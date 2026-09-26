"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { coalitionChoices, emptyDecision, netanyahuChoices, orientationChoices, parties, priorityOptions, type DecisionState } from "./parties";

type SaveState = "loading" | "saved" | "saving" | "error";
type Pending = {
  apply: (previous: DecisionState) => DecisionState;
  state: DecisionState;
  kind: string;
  resolve?: (saved: boolean) => void;
};
const KEY_STORAGE = "bechira-recovery-key-v1";
const PREVIOUS_KEY_STORAGE = "vote-room-previous-recovery-key-v1";

function getOrCreateKey(): string {
  const existing = window.localStorage.getItem(KEY_STORAGE);
  if (existing && /^[a-f0-9]{64}$/.test(existing)) return existing;
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const key = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  window.localStorage.setItem(KEY_STORAGE, key);
  return key;
}

export function useDecision() {
  const [state, setState] = useState<DecisionState | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [previousRecoveryKey, setPreviousRecoveryKey] = useState<string | null>(null);
  const [account, setAccount] = useState<{ email: string } | null>(null);
  const keyRef = useRef("");
  const revision = useRef(0);
  const current = useRef<DecisionState>(emptyDecision);
  const queue = useRef<Pending[]>([]);
  const busy = useRef(false);
  const errored = useRef(false);
  const waiters = useRef<Array<(saved: boolean) => void>>([]);

  useEffect(() => {
    let live = true;
    try {
      keyRef.current = getOrCreateKey();
      setRecoveryKey(keyRef.current);
      setPreviousRecoveryKey(window.localStorage.getItem(PREVIOUS_KEY_STORAGE));
    } catch {
      setSaveState("error");
      return () => { live = false; };
    }
    fetch("/api/decision", { cache: "no-store", headers: { "x-decision-key": keyRef.current } })
      .then(async (response) => {
        if (!response.ok) throw new Error("storage");
        return response.json() as Promise<{ revision: number; state: DecisionState; account: { email: string } | null }>;
      })
      .then((data) => {
        if (!live) return;
        revision.current = data.revision;
        current.current = { ...emptyDecision, ...data.state };
        setState(current.current);
        setAccount(data.account);
        setSaveState("saved");
      })
      .catch(() => {
        if (live) setSaveState("error");
      });
    return () => { live = false; };
  }, []);

  const drain = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    errored.current = false;
    let conflicts = 0;
    while (queue.current.length) {
      const item = queue.current[0];
      try {
        const response = await fetch("/api/decision", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-decision-key": keyRef.current },
          body: JSON.stringify({ ...item, expectedRevision: revision.current }),
          keepalive: true,
        });
        if (response.status === 409) {
          if (++conflicts > 5) throw new Error("too_many_conflicts");
          const latestResponse = await fetch("/api/decision", {
            cache: "no-store", headers: { "x-decision-key": keyRef.current },
          });
          if (!latestResponse.ok) throw new Error("storage");
          const latest = await latestResponse.json() as { revision: number; state: DecisionState };
          revision.current = latest.revision;
          // A lost response can mean the write succeeded. Do not replay a
          // toggle in that case.
          if (JSON.stringify(latest.state) === JSON.stringify(item.state)) {
            queue.current.shift();
            item.resolve?.(true);
          }
          let rebased = { ...emptyDecision, ...latest.state };
          for (const pending of queue.current) {
            rebased = pending.apply(rebased);
            pending.state = rebased;
          }
          current.current = rebased;
          setState(rebased);
          continue;
        }
        if (!response.ok) throw new Error("storage");
        const result = await response.json() as { revision: number };
        revision.current = result.revision;
        queue.current.shift();
        item.resolve?.(true);
      } catch {
        queue.current.forEach((pending) => { pending.resolve?.(false); pending.resolve = undefined; });
        errored.current = true;
        waiters.current.splice(0).forEach((resolve) => resolve(false));
        setSaveState("error");
        busy.current = false;
        return;
      }
    }
    setSaveState("saved");
    busy.current = false;
    waiters.current.splice(0).forEach((resolve) => resolve(true));
  }, []);

  const update = useCallback((fn: (previous: DecisionState) => DecisionState, kind: string): Promise<boolean> => {
    const next = fn(current.current);
    current.current = next;
    setState(next);
    return new Promise((resolve) => {
      queue.current.push({ apply: fn, state: next, kind, resolve });
      setSaveState("saving");
      void drain();
    });
  }, [drain]);

  const waitForSave = useCallback((): Promise<boolean> => {
    if (errored.current) return Promise.resolve(false);
    if (!queue.current.length && !busy.current) return Promise.resolve(true);
    return new Promise((resolve) => waiters.current.push(resolve));
  }, []);

  const retry = useCallback(() => {
    if (!queue.current.length) { window.location.reload(); return; }
    errored.current = false;
    setSaveState("saving");
    void drain();
  }, [drain]);

  const restoreRecoveryKey = useCallback((key: string): boolean => {
    const clean = key.trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(clean)) return false;
    try {
      const existing = window.localStorage.getItem(KEY_STORAGE);
      if (existing && existing !== clean) {
        window.localStorage.setItem(PREVIOUS_KEY_STORAGE, existing);
        setPreviousRecoveryKey(existing);
      }
      window.localStorage.setItem(KEY_STORAGE, clean);
      window.location.reload();
      return true;
    } catch { return false; }
  }, []);

  const restorePreviousKey = useCallback(() => {
    if (previousRecoveryKey) restoreRecoveryKey(previousRecoveryKey);
  }, [previousRecoveryKey, restoreRecoveryKey]);

  useEffect(() => {
    if (!state) return;
    type Tool = {
      name: string; title: string; description: string; inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const context = (document as Document & {
      modelContext?: { registerTool: (tool: Tool, options: { signal: AbortSignal }) => void | Promise<void> };
    }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const report = (error: unknown) => console.warn("WebMCP registration failed", error);
    const register = (tool: Tool) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(report); }
      catch (error) { report(error); }
    };
    register({
      name: "read_voting_reflection",
      title: "קרא את המצפן שלי",
      description: "Read the user's current saved voting priorities and reflections on this site.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ state: current.current, revision: revision.current }),
    });
    register({
      name: "save_voting_reflection",
      title: "שמור שינוי במצפן",
      description: "Save the user's own priorities, coalition preference, party impression, or general note. Updates the visible interface and its saved history.",
      inputSchema: {
        type: "object",
        properties: {
          orientation: { type: "string", enum: orientationChoices.map((item) => item.value) },
          priorities: { type: "array", items: { type: "string" }, maxItems: 30 },
          arabCoalition: { type: "string", enum: ["", ...coalitionChoices.map((item) => item.value)] },
          netanyahuCoalition: { type: "string", enum: ["", ...netanyahuChoices.map((item) => item.value)] },
          partySlug: { type: "string", enum: parties.map((item) => item.slug) },
          partyStatus: { type: "string", enum: ["open", "positive", "concerned", "out"] },
          generalNotes: { type: "string", maxLength: 10000 },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input: unknown) {
        if (!input || typeof input !== "object") throw new Error("Invalid input");
        const values = input as Record<string, unknown>;
        const known = ["orientation", "priorities", "arabCoalition", "netanyahuCoalition", "partySlug", "partyStatus", "generalNotes"];
        if (!Object.keys(values).length || Object.keys(values).some((key) => !known.includes(key))) throw new Error("Invalid fields");
        if (values.orientation !== undefined && !orientationChoices.some((item) => item.value === values.orientation)) throw new Error("Invalid starting path");
        if (values.priorities !== undefined && (!Array.isArray(values.priorities) || values.priorities.length > 30 ||
          values.priorities.some((tag) => typeof tag !== "string" || !tag.trim() || tag.length > 80))) throw new Error("Invalid priorities");
        if (values.priorities && new Set([
          ...current.current.customTags,
          ...(values.priorities as string[]).filter((tag) => !priorityOptionsSet.has(tag)),
        ]).size > 20) throw new Error("Too many custom priorities");
        if (values.arabCoalition !== undefined && !coalitionChoices.some((item) => item.value === values.arabCoalition) && values.arabCoalition !== "") throw new Error("Invalid coalition choice");
        if (values.netanyahuCoalition !== undefined && !netanyahuChoices.some((item) => item.value === values.netanyahuCoalition) && values.netanyahuCoalition !== "") throw new Error("Invalid coalition choice");
        if ((values.partySlug !== undefined || values.partyStatus !== undefined) &&
          (!parties.some((item) => item.slug === values.partySlug) || !["open", "positive", "concerned", "out"].includes(String(values.partyStatus)))) throw new Error("Invalid party impression");
        if (values.generalNotes !== undefined && (typeof values.generalNotes !== "string" || values.generalNotes.length > 10000)) throw new Error("Invalid note");
        const saved = await update((previous) => {
          const priorities = values.priorities as string[] | undefined;
          return {
            ...previous,
            orientation: (values.orientation as string | undefined) ?? previous.orientation,
            priorities: priorities ?? previous.priorities,
            customTags: priorities
              ? Array.from(new Set([...previous.customTags, ...priorities.filter((tag) => !priorityOptionsSet.has(tag))]))
              : previous.customTags,
            arabCoalition: (values.arabCoalition as string | undefined) ?? previous.arabCoalition,
            netanyahuCoalition: (values.netanyahuCoalition as string | undefined) ?? previous.netanyahuCoalition,
            partyStatus: values.partySlug
              ? { ...previous.partyStatus, [values.partySlug as string]: values.partyStatus as string }
              : previous.partyStatus,
            generalNotes: (values.generalNotes as string | undefined) ?? previous.generalNotes,
          };
        }, "agent_reflection");
        if (!saved) throw new Error("The change could not be saved. The user's visible draft remains available.");
        return { saved: true, revision: revision.current };
      },
    });
    return () => lifecycle.abort();
  }, [state, update]);

  return { state, saveState, update, retry, waitForSave, recoveryKey, previousRecoveryKey, restoreRecoveryKey, restorePreviousKey, account };
}

const priorityOptionsSet = new Set(priorityOptions);

export function SaveIndicator({ status, retry }: { status: SaveState; retry: () => void }) {
  if (status === "error") {
    return <button type="button" className="save-indicator error" onClick={retry}>השמירה נכשלה. נסה שוב</button>;
  }
  return <span className={`save-indicator ${status === "saved" ? "saved" : ""}`} aria-live="polite">
    {status === "saved" ? "כל השינויים נשמרו" : status === "saving" ? "שומר…" : "טוען…"}
  </span>;
}

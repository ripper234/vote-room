"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { coalitionChoices, emptyDecision, netanyahuChoices, orientationChoices, parties, priorityOptions, type DecisionState } from "./parties";
import { KEY_STORAGE, PREVIOUS_KEY_STORAGE, SESSION_CLEAR_STORAGE } from "./decision-key";

type SaveState = "loading" | "saved" | "saving" | "error";
type Pending = {
  apply: (previous: DecisionState) => DecisionState;
  state: DecisionState;
  kind: string;
  resolve?: (saved: boolean) => void;
};
type GuestConflict = { revision: number; state: DecisionState; choiceKind: string };

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
  const [guestConflict, setGuestConflict] = useState<GuestConflict | null>(null);
  const [guestConflictDismissed, setGuestConflictDismissed] = useState(false);
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
      // Signed-in maps work even when browser storage is unavailable.
      keyRef.current = "";
    }
    fetch("/api/decision", { cache: "no-store", headers: keyRef.current ? { "x-decision-key": keyRef.current } : {} })
      .then(async (response) => {
        if (!response.ok) throw new Error("storage");
        return response.json() as Promise<{ revision: number; state: DecisionState; account: { email: string } | null; guestConflict: GuestConflict | null }>;
      })
      .then((data) => {
        if (!live) return;
        revision.current = data.revision;
        current.current = { ...emptyDecision, ...data.state };
        setState(current.current);
        setAccount(data.account);
        setGuestConflict(data.guestConflict);
        setGuestConflictDismissed(false);
        setSaveState("saved");
      })
      .catch(() => {
        if (live) setSaveState("error");
      });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    const refresh = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    const clearOtherTab = (event: StorageEvent) => {
      if (event.key === SESSION_CLEAR_STORAGE) window.location.replace("/");
    };
    window.addEventListener("pageshow", refresh);
    window.addEventListener("storage", clearOtherTab);
    return () => {
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("storage", clearOtherTab);
    };
  }, []);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (queue.current.length || busy.current || errored.current) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
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
          headers: { "Content-Type": "application/json", ...(keyRef.current ? { "x-decision-key": keyRef.current } : {}) },
          body: JSON.stringify({ ...item, expectedRevision: revision.current }),
          keepalive: true,
        });
        if (response.status === 409) {
          if (++conflicts > 5) throw new Error("too_many_conflicts");
          const latestResponse = await fetch("/api/decision", {
            cache: "no-store", headers: keyRef.current ? { "x-decision-key": keyRef.current } : {},
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

  const waitForSave = useCallback((timeoutMs = 8000): Promise<boolean> => {
    if (errored.current) return Promise.resolve(false);
    if (!queue.current.length && !busy.current) return Promise.resolve(true);
    return new Promise((resolve) => {
      const done = (saved: boolean) => { window.clearTimeout(timer); resolve(saved); };
      const timer = window.setTimeout(() => {
        waiters.current = waiters.current.filter((waiter) => waiter !== done);
        resolve(false);
      }, timeoutMs);
      waiters.current.push(done);
    });
  }, []);

  const retry = useCallback(() => {
    if (!queue.current.length) { window.location.reload(); return; }
    errored.current = false;
    setSaveState("saving");
    void drain();
  }, [drain]);

  const restoreRecoveryKey = useCallback(async (key: string): Promise<boolean> => {
    const clean = key.trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(clean)) return false;
    try {
      const result = await fetch("/api/decision?scope=guest", { cache: "no-store", headers: { "x-decision-key": clean } });
      if (!result.ok || (await result.json() as { revision: number }).revision === 0) return false;
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
    if (previousRecoveryKey) void restoreRecoveryKey(previousRecoveryKey);
  }, [previousRecoveryKey, restoreRecoveryKey]);

  const dismissGuestConflict = useCallback(async (): Promise<boolean> => {
    if (!guestConflict) return false;
    // A no-op account snapshot records this particular guest choice in the
    // account history. The save queue serializes it with any pending edits.
    const saved = await update((previous) => previous, guestConflict.choiceKind);
    if (saved) setGuestConflictDismissed(true);
    return saved;
  }, [guestConflict, update]);

  const reopenGuestConflict = useCallback(() => {
    setGuestConflictDismissed(false);
  }, []);

  const replaceFromGuest = useCallback(async () => {
    if (!guestConflict) return false;
    const saved = await update(() => guestConflict.state, "guest_replace");
    if (saved) { setGuestConflict(null); setGuestConflictDismissed(true); }
    return saved;
  }, [guestConflict, update]);

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

  return { state, saveState, update, retry, waitForSave, recoveryKey, previousRecoveryKey, restoreRecoveryKey, restorePreviousKey, account, guestConflict, guestConflictDismissed, dismissGuestConflict, reopenGuestConflict, replaceFromGuest };
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

export function SaveNavigationWarning({ destination, retry, waitForSave, onClose }: {
  destination: string;
  retry: () => void;
  waitForSave: () => Promise<boolean>;
  onClose: () => void;
}) {
  async function retryAndGo() {
    retry();
    if (await waitForSave()) window.location.assign(destination);
  }

  return <div className="save-navigation-warning" role="alert">
    <button type="button" className="save-navigation-close" onClick={onClose} aria-label="סגור">×</button>
    <strong>לא הצלחנו לשמור לפני המעבר.</strong>
    <p>אפשר לנסות שוב או להמשיך בלי לשמור את השינויים האחרונים.</p>
    <div className="save-navigation-actions">
      <button type="button" className="button" onClick={retryAndGo}>נסה שוב ועבור</button>
      <a className="button secondary" href={destination}>המשך בלי לשמור</a>
      <a href="/account">יצירת חשבון</a>
    </div>
  </div>;
}

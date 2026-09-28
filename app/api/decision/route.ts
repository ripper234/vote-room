import { deleteDecisions, hasKeptGuestState, lastImportedGuestState, readDecision, writeDecision } from "../../../db/decision";
import { anonymousUserId, signedInUser } from "../../../lib/decision-identity";
import { coalitionChoices, netanyahuChoices, orientationChoices, parties, priorityOptions, type DecisionState } from "../../../lib/parties";

const noStore = { "Cache-Control": "no-store" };
const allowedSlugs = new Set(parties.map((party) => party.slug));
const allowedStatus = new Set(["open", "positive", "concerned", "out"]);
const allowedAssessment = new Set(["aligned", "unclear", "misaligned"]);
const allowedCoalition = new Set(["", ...coalitionChoices.map((choice) => choice.value)]);
const allowedNetanyahu = new Set(["", ...netanyahuChoices.map((choice) => choice.value)]);
const allowedOrientation = new Set(["", ...orientationChoices.map((choice) => choice.value)]);
const stateFields = new Set(["orientation", "priorities", "customTags", "arabCoalition", "netanyahuCoalition", "partyStatus", "issueAssessments", "partyNotes", "generalNotes", "includeLieberman", "comparisonSlugs"]);
const MAX_BODY_BYTES = 150_000;

async function guestChoiceKind(anonymousId: string, state: DecisionState): Promise<string> {
  // A choice belongs to one guest map and its contents. A later guest edit
  // changes the digest, while account edits do not reopen an old choice.
  const input = new TextEncoder().encode(`${anonymousId}:${JSON.stringify(state)}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  const fingerprint = Array.from(new Uint8Array(digest).slice(0, 14), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `guest_keep_${fingerprint}`;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return (!origin || origin === new URL(request.url).origin) && request.headers.get("sec-fetch-site") !== "cross-site";
}

async function boundedJson(request: Request): Promise<unknown> {
  const advertised = Number(request.headers.get("content-length") ?? 0);
  if (advertised > MAX_BODY_BYTES) throw new Error("too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_json");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("too_large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function validState(input: unknown): input is DecisionState {
  if (!input || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).length !== stateFields.size || Object.keys(input).some((field) => !stateFields.has(field))) return false;
  const state = input as Partial<DecisionState>;
  const stringList = (value: unknown, max: number) =>
    Array.isArray(value) && value.length <= max &&
    value.every((item) => typeof item === "string" && item.length > 0 && item.length <= 80);
  const textMap = (value: unknown, maxLength: number, allowed?: Set<string>) =>
    !!value && typeof value === "object" && !Array.isArray(value) &&
    Object.entries(value).every(([key, text]) =>
      allowedSlugs.has(key) && typeof text === "string" && text.length <= maxLength &&
      (!allowed || allowed.has(text))
    );
  return stringList(state.priorities, 30) &&
    typeof state.orientation === "string" && allowedOrientation.has(state.orientation) &&
    stringList(state.customTags, 20) &&
    typeof state.arabCoalition === "string" && allowedCoalition.has(state.arabCoalition) &&
    typeof state.netanyahuCoalition === "string" && allowedNetanyahu.has(state.netanyahuCoalition) &&
    textMap(state.partyStatus, 24, allowedStatus) &&
    !!state.issueAssessments && typeof state.issueAssessments === "object" && !Array.isArray(state.issueAssessments) &&
    Object.entries(state.issueAssessments).every(([slug, ratings]) =>
      allowedSlugs.has(slug) && !!ratings && typeof ratings === "object" && !Array.isArray(ratings) &&
      Object.entries(ratings).length <= 30 &&
      Object.keys(ratings).every((tag) => priorityOptionsSet.has(tag) || state.customTags?.includes(tag)) &&
      Object.entries(ratings).every(([tag, value]) => tag.length > 0 && tag.length <= 80 &&
        typeof value === "string" && allowedAssessment.has(value))
    ) &&
    textMap(state.partyNotes, 5000) &&
    typeof state.generalNotes === "string" && state.generalNotes.length <= 10000 &&
    typeof state.includeLieberman === "boolean" &&
    Array.isArray(state.comparisonSlugs) && state.comparisonSlugs.length <= 3 &&
    new Set(state.comparisonSlugs).size === state.comparisonSlugs.length &&
    state.comparisonSlugs.every((slug) => typeof slug === "string" && allowedSlugs.has(slug));
}

const priorityOptionsSet = new Set(priorityOptions);

export async function GET(request: Request) {
  const guestOnly = new URL(request.url).searchParams.get("scope") === "guest";
  const account = guestOnly ? null : signedInUser(request);
  const anonymousId = await anonymousUserId(request);
  const userId = account?.id ?? anonymousId;
  if (!userId) return Response.json({ error: "invalid_device_key" }, { status: 400, headers: noStore });
  try {
    let decision = await readDecision(userId);
    let imported = false;
    let guestConflict: { revision: number; state: DecisionState; choiceKind: string } | null = null;
    // A first sign-in adopts the visitor's existing device map. A returning
    // account always wins; its history is never replaced by a device copy.
    if (account && decision.revision === 0 && anonymousId) {
      const local = await readDecision(anonymousId);
      if (local.revision > 0) {
        const result = await writeDecision(account.id, 0, local.state, "account_import");
        decision = await readDecision(account.id);
        imported = !!result;
      }
    }
    if (account && decision.revision > 0 && anonymousId) {
      const guest = await readDecision(anonymousId);
      if (guest.revision > 0 && JSON.stringify(guest.state) !== JSON.stringify(decision.state)) {
        const importedState = await lastImportedGuestState(account.id);
        if (JSON.stringify(importedState) !== JSON.stringify(guest.state)) {
          const choiceKind = await guestChoiceKind(anonymousId, guest.state);
          if (!await hasKeptGuestState(account.id, choiceKind)) {
            guestConflict = { revision: guest.revision, state: guest.state, choiceKind };
          }
        }
      }
    }
    return Response.json({ ...decision, account: account ? { email: account.email } : null, imported, guestConflict }, { headers: noStore });
  } catch (error) {
    console.error("decision read failed", error);
    return Response.json({ error: "temporary_storage_error" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  const userId = signedInUser(request)?.id ?? await anonymousUserId(request);
  if (!userId) return Response.json({ error: "invalid_device_key" }, { status: 400, headers: noStore });
  if (!sameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403, headers: noStore });
  }
  let payload: unknown;
  try {
    payload = await boundedJson(request);
  } catch (error) {
    return Response.json({ error: error instanceof Error && error.message === "too_large" ? "too_large" : "invalid_json" }, { status: error instanceof Error && error.message === "too_large" ? 413 : 400, headers: noStore });
  }
  if (!payload || typeof payload !== "object") {
    return Response.json({ error: "invalid_payload" }, { status: 400, headers: noStore });
  }
  const { state, expectedRevision, kind } = payload as Record<string, unknown>;
  if (!validState(state) || !Number.isSafeInteger(expectedRevision) ||
      (expectedRevision as number) < 0 || typeof kind !== "string" || kind.length > 40) {
    return Response.json({ error: "invalid_payload" }, { status: 400, headers: noStore });
  }
  try {
    const saved = await writeDecision(userId, expectedRevision as number, state, kind);
    if (!saved) return Response.json({ error: "revision_conflict" }, { status: 409, headers: noStore });
    return Response.json(saved, { headers: noStore });
  } catch (error) {
    console.error("decision write failed", error);
    return Response.json({ error: "temporary_storage_error" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "invalid_origin" }, { status: 403, headers: noStore });
  const account = signedInUser(request);
  const anonymousId = await anonymousUserId(request);
  if (!account && !anonymousId) return Response.json({ error: "invalid_device_key" }, { status: 400, headers: noStore });
  try {
    const payload = await boundedJson(request) as { confirm?: string };
    if (payload?.confirm !== "delete_my_decisions") return Response.json({ error: "confirmation_required" }, { status: 400, headers: noStore });
    await deleteDecisions([account?.id, anonymousId].filter((id): id is string => Boolean(id)));
    return Response.json({ deleted: true }, { headers: noStore });
  } catch (error) {
    console.error("decision delete failed", error);
    return Response.json({ error: "temporary_storage_error" }, { status: 503, headers: noStore });
  }
}

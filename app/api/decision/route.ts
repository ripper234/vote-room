import { readDecision, writeDecision } from "../../../db/decision";
import { coalitionChoices, netanyahuChoices, orientationChoices, parties, type DecisionState } from "../../../lib/parties";

const noStore = { "Cache-Control": "no-store" };
const allowedSlugs = new Set(parties.map((party) => party.slug));
const allowedStatus = new Set(["open", "positive", "concerned", "out"]);
const allowedAssessment = new Set(["aligned", "unclear", "misaligned"]);
const allowedCoalition = new Set(["", ...coalitionChoices.map((choice) => choice.value)]);
const allowedNetanyahu = new Set(["", ...netanyahuChoices.map((choice) => choice.value)]);
const allowedOrientation = new Set(["", ...orientationChoices.map((choice) => choice.value)]);

async function anonymousUserId(request: Request): Promise<string | null> {
  const key = request.headers.get("x-decision-key");
  if (!key || !/^[a-f0-9]{64}$/.test(key)) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return "anon:" + Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validState(input: unknown): input is DecisionState {
  if (!input || typeof input !== "object") return false;
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
      Object.entries(ratings).every(([tag, value]) => tag.length > 0 && tag.length <= 80 &&
        typeof value === "string" && allowedAssessment.has(value))
    ) &&
    textMap(state.partyNotes, 5000) &&
    typeof state.generalNotes === "string" && state.generalNotes.length <= 10000 &&
    typeof state.includeLieberman === "boolean";
}

export async function GET(request: Request) {
  const userId = await anonymousUserId(request);
  if (!userId) return Response.json({ error: "invalid_device_key" }, { status: 400, headers: noStore });
  try {
    return Response.json(await readDecision(userId), { headers: noStore });
  } catch (error) {
    console.error("decision read failed", error);
    return Response.json({ error: "temporary_storage_error" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: Request) {
  const userId = await anonymousUserId(request);
  if (!userId) return Response.json({ error: "invalid_device_key" }, { status: 400, headers: noStore });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "invalid_origin" }, { status: 403, headers: noStore });
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400, headers: noStore });
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

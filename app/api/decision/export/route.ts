import { readDecision, readDecisionHistory } from "../../../../db/decision";
import { anonymousUserId, signedInUser } from "../../../../lib/decision-identity";

export async function GET(request: Request) {
  const account = new URL(request.url).searchParams.get("scope") === "guest" ? null : signedInUser(request);
  const userId = account?.id ?? await anonymousUserId(request);
  if (!userId) return Response.json({ error: "invalid_device_key" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  try {
    const [decision, history] = await Promise.all([readDecision(userId), readDecisionHistory(userId)]);
    return new Response(JSON.stringify({
      exportedAt: new Date().toISOString(),
      record: account ? "account" : "guest",
      decision,
      history,
    }, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="vote-room-data.json"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("decision export failed", error);
    return Response.json({ error: "temporary_storage_error" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

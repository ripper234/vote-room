import { saveFeedback } from "../../../db/feedback";

const headers = { "Cache-Control": "no-store" };
const maxBodyBytes = 8_192;
const kinds = new Set(["idea", "problem", "correction"]);

function reply(error: string, status: number) {
  return Response.json({ error }, { status, headers });
}

async function readJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length") ?? 0) > maxBodyBytes) throw new Error("too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_json");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBodyBytes) {
      await reader.cancel();
      throw new Error("too_large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function rateKey(request: Request, day: number): Promise<string | null> {
  // Cloudflare sets this header; ignore client-supplied forwarding headers.
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip || ip.length > 64 || !/^[\da-fA-F:.]+$/.test(ip)) return null;
  const input = new TextEncoder().encode(`vote-room-feedback:${new URL(request.url).host}:${day}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply("invalid_origin", 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reply("invalid_content_type", 415);
  }

  let input: unknown;
  try {
    input = await readJson(request);
  } catch (error) {
    return reply(error instanceof Error && error.message === "too_large" ? "too_large" : "invalid_json",
      error instanceof Error && error.message === "too_large" ? 413 : 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return reply("invalid_payload", 400);
  const payload = input as Record<string, unknown>;
  // Hidden form field: quietly discard automated submissions.
  if (payload.website) return Response.json({ ok: true }, { headers });
  const kind = payload.kind;
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const pagePath = payload.pagePath;
  const contactEmail = typeof payload.contactEmail === "string" ? payload.contactEmail.trim() : "";
  if (typeof kind !== "string" || !kinds.has(kind) || message.length < 5 || message.length > 2_000 ||
      typeof pagePath !== "string" || pagePath.length > 240 || !pagePath.startsWith("/") || pagePath.startsWith("//") ||
      /[\u0000-\u001f?#]/.test(pagePath) ||
      contactEmail.length > 254 || (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))) {
    return reply("invalid_payload", 400);
  }

  try {
    const day = Math.floor(Date.now() / 86_400_000);
    const key = await rateKey(request, day);
    const saved = await saveFeedback({ kind, message, pagePath, contactEmail: contactEmail || null }, key, day);
    if (!saved) return reply("rate_limited", 429);
    return Response.json({ ok: true }, { status: 201, headers });
  } catch (error) {
    console.error("feedback save failed", error);
    return reply("temporary_storage_error", 503);
  }
}

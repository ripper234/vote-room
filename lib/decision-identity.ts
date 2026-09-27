export async function anonymousUserId(request: Request): Promise<string | null> {
  const key = request.headers.get("x-decision-key");
  if (!key || !/^[a-f0-9]{64}$/.test(key)) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return "anon:" + Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function signedInUser(request: Request): { id: string; email: string } | null {
  // Sites supplies these identity headers after Sign in with ChatGPT.
  const id = request.headers.get("oai-authenticated-user-id");
  const email = request.headers.get("oai-authenticated-user-email");
  return id && email ? { id: `chatgpt:${id}`, email } : null;
}

import { env } from "cloudflare:workers";

type FeedbackEntry = {
  kind: string;
  message: string;
  pagePath: string;
  contactEmail: string | null;
};

function database(): D1Database {
  if (!env.DB) throw new Error("Feedback database unavailable");
  return env.DB;
}

export async function saveFeedback(entry: FeedbackEntry, dailyRateKey: string | null, day: number) {
  const db = database();
  if (dailyRateKey) {
    await db.prepare("DELETE FROM feedback_rate_limits WHERE day < ?").bind(day - 2).run();
    // This upsert is atomic even when several tabs submit at once.
    const rate = await db.prepare(
      "INSERT INTO feedback_rate_limits (key, day, uses) VALUES (?, ?, 1) " +
      "ON CONFLICT(key) DO UPDATE SET uses = uses + 1 WHERE uses < 10"
    ).bind(dailyRateKey, day).run();
    if (rate.meta.changes === 0) return false;
  }
  await db.prepare(
    "INSERT INTO feedback (kind, message, page_path, contact_email) VALUES (?, ?, ?, ?)"
  ).bind(entry.kind, entry.message, entry.pagePath, entry.contactEmail).run();
  return true;
}

import { env } from "cloudflare:workers";
import { emptyDecision, type DecisionState } from "../lib/parties";

type SavedRow = { revision: number; state_json: string; updated_at: string };

function database(): D1Database {
  if (!env.DB) throw new Error("Decision database unavailable");
  return env.DB;
}

export async function readDecision(userId: string) {
  const row = await database().prepare(
    "SELECT revision, state_json, updated_at FROM decision_states WHERE user_id = ?"
  ).bind(userId).first<SavedRow>();
  if (!row) return { revision: 0, state: emptyDecision, updatedAt: null };
  return { revision: row.revision, state: JSON.parse(row.state_json) as DecisionState, updatedAt: row.updated_at };
}

export async function writeDecision(userId: string, expectedRevision: number, state: DecisionState, kind: string) {
  const db = database();
  const current = await db.prepare("SELECT revision FROM decision_states WHERE user_id = ?")
    .bind(userId).first<{ revision: number }>();
  if ((current?.revision ?? 0) !== expectedRevision) return null;

  const nextRevision = expectedRevision + 1;
  const json = JSON.stringify(state);
  const mutation = current
    ? db.prepare("UPDATE decision_states SET revision = ?, state_json = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revision = ?")
      .bind(nextRevision, json, userId, expectedRevision)
    : db.prepare("INSERT INTO decision_states (user_id, revision, state_json, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)")
      .bind(userId, nextRevision, json);
  const event = db.prepare(
    "INSERT INTO decision_events (user_id, revision, kind, snapshot_json, created_at) " +
    "SELECT user_id, revision, ?, state_json, CURRENT_TIMESTAMP FROM decision_states " +
    "WHERE user_id = ? AND revision = ? AND state_json = ?"
  ).bind(kind, userId, nextRevision, json);

  try {
    const results = await db.batch([mutation, event]);
    if (results[0].meta.changes !== 1 || results[1].meta.changes !== 1) return null;
    return { revision: nextRevision };
  } catch (error) {
    // A concurrent save can lose the race on the unique revision index.
    if (error instanceof Error && /UNIQUE constraint failed/.test(error.message)) return null;
    throw error;
  }
}

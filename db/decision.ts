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

export async function readDecisionHistory(userId: string) {
  const result = await database().prepare(
    "SELECT revision, kind, snapshot_json, created_at FROM decision_events WHERE user_id = ? ORDER BY revision ASC"
  ).bind(userId).all<{ revision: number; kind: string; snapshot_json: string; created_at: string }>();
  return result.results.map((row) => ({
    revision: row.revision,
    kind: row.kind,
    state: JSON.parse(row.snapshot_json) as DecisionState,
    createdAt: row.created_at,
  }));
}

export async function lastImportedGuestState(userId: string): Promise<DecisionState | null> {
  const row = await database().prepare(
    "SELECT snapshot_json FROM decision_events WHERE user_id = ? AND kind IN ('account_import', 'guest_replace') ORDER BY id DESC LIMIT 1"
  ).bind(userId).first<{ snapshot_json: string }>();
  return row ? JSON.parse(row.snapshot_json) as DecisionState : null;
}

export async function deleteDecisions(userIds: string[]) {
  const db = database();
  await db.batch([...new Set(userIds)].flatMap((userId) => [
    db.prepare("DELETE FROM decision_events WHERE user_id = ?").bind(userId),
    db.prepare("DELETE FROM decision_states WHERE user_id = ?").bind(userId),
  ]));
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

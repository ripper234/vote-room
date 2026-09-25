import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const decisionStates = sqliteTable("decision_states", {
  userId: text("user_id").primaryKey(),
  revision: integer("revision").notNull().default(0),
  stateJson: text("state_json").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const decisionEvents = sqliteTable("decision_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  revision: integer("revision").notNull(),
  kind: text("kind").notNull(),
  snapshotJson: text("snapshot_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_decision_events_user_revision").on(table.userId, table.revision),
  index("idx_decision_events_user_id").on(table.userId, table.id),
]);

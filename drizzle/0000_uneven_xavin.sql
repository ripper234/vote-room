CREATE TABLE `decision_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`revision` integer NOT NULL,
	`kind` text NOT NULL,
	`snapshot_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_decision_events_user_revision` ON `decision_events` (`user_id`,`revision`);--> statement-breakpoint
CREATE INDEX `idx_decision_events_user_id` ON `decision_events` (`user_id`,`id`);--> statement-breakpoint
CREATE TABLE `decision_states` (
	`user_id` text PRIMARY KEY NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`state_json` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`message` text NOT NULL,
	`page_path` text NOT NULL,
	`contact_email` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feedback_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`day` integer NOT NULL,
	`uses` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_feedback_rate_limits_day` ON `feedback_rate_limits` (`day`);
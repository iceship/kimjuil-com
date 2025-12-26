CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`fen` text,
	`pgn` text NOT NULL,
	`thumbnail` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);

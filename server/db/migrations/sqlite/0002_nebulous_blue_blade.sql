CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`fen` text,
	`pgn` text NOT NULL,
	`created_at` integer NOT NULL
);

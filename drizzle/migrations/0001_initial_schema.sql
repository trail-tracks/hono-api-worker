CREATE TABLE `entities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`name_complement` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`zip_code` text NOT NULL,
	`address` text NOT NULL,
	`number` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`address_complement` text,
	`phone` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entities_email_unique` ON `entities` (`email`);--> statement-breakpoint
DROP TABLE `users`;
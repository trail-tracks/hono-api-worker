CREATE TABLE `institutions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`password` text NOT NULL,
	`profile_image` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `institutions_email_unique` ON `institutions` (`email`);
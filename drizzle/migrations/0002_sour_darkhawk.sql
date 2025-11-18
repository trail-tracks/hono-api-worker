CREATE TABLE `points_of_interest` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`short_description` text NOT NULL,
	`description` text,
	`trail_id` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`trail_id`) REFERENCES `trails`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trails` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`short_description` text NOT NULL,
	`duration` text NOT NULL,
	`distance` text NOT NULL,
	`difficulty` text NOT NULL,
	`description` text,
	`safety_tips` text,
	`entity_id` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_trails`("id", "name", "short_description", "duration", "distance", "difficulty", "description", "safety_tips", "entity_id", "created_at", "updated_at") SELECT "id", "name", "short_description", "duration", "distance", "difficulty", "description", "safety_tips", "entity_id", "created_at", "updated_at" FROM `trails`;--> statement-breakpoint
DROP TABLE `trails`;--> statement-breakpoint
ALTER TABLE `__new_trails` RENAME TO `trails`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `attachments` ADD `point_of_interest_id` integer REFERENCES points_of_interest(id);
CREATE TABLE `attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`bucket` text NOT NULL,
	`object_key` text NOT NULL,
	`mime_type` text,
	`size` integer,
	`url` text,
	`entity_id` integer,
	`trail_id` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`trail_id`) REFERENCES `trails`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attachments_uuid_unique` ON `attachments` (`uuid`);--> statement-breakpoint
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
	`phone` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entities_email_unique` ON `entities` (`email`);--> statement-breakpoint
CREATE TABLE `trails` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`short_description` text,
	`duration` integer,
	`distance` integer,
	`difficulty` text,
	`entity_id` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE cascade ON DELETE cascade
);

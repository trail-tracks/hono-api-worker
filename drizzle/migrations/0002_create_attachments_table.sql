CREATE TABLE `attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`bucket` text NOT NULL,
	`object_key` text NOT NULL,
	`mime_type` text,
	`size` integer,
	`url` text,
	`entity_id` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE CASCADE ON DELETE SET NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attachments_uuid_unique` ON `attachments` (`uuid`);
--> statement-breakpoint
CREATE INDEX `attachments_entity_idx` ON `attachments` (`entity_id`);

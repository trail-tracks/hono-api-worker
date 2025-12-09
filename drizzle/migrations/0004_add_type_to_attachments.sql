-- Migration: Add type column to attachments table
ALTER TABLE `attachments` ADD `type` text DEFAULT 'gallery' NOT NULL;

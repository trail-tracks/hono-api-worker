import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { parseSigned } from 'hono/utils/cookie';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
});

export const institutions = sqliteTable('institutions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone').notNull(),
  password: text('password').notNull(),
  profile_image: text('profile_image').notNull(),
});

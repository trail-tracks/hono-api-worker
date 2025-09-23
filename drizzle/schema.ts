import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const entity = sqliteTable('entities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  nameComplement: text('name_complement'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  zipCode: text('zip_code').notNull(),
  address: text('address').notNull(),
  number: text('number').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  addressComplement: text('address_complement'),
  phone: text('phone').notNull(),
});

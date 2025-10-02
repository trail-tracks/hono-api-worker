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

export const attachment = sqliteTable('attachments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  bucket: text('bucket').notNull(),
  objectKey: text('object_key').notNull(),
  mimeType: text('mime_type'),
  size: integer('size'),
  url: text('url'),
  entityId: integer('entity_id').references(() => entity.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

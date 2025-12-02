import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
  deletedAt: text('deleted_at'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const trail = sqliteTable('trails', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  shortDescription: text('short_description').notNull(),
  duration: text('duration').notNull(),
  distance: text('distance').notNull(),
  difficulty: text('difficulty').notNull(),
  description: text('description'),
  safetyTips: text('safety_tips'),
  entityId: integer('entity_id').references(() => entity.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const pointOfInterest = sqliteTable('points_of_interest', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  shortDescription: text('short_description').notNull(),
  description: text('description'),
  trailId: integer('trail_id').references(() => trail.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
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
  trailId: integer('trail_id').references(() => trail.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  pointOfInterestId: integer('point_of_interest_id').references(() => pointOfInterest.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

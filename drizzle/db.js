import { drizzle } from 'drizzle-orm/d1';
export const getDb = (db) => drizzle(db);

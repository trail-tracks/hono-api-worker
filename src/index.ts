import { Hono } from 'hono';
import { users } from './schema';
import { getDb } from './db';

type Env = { DB: D1Database };

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => c.text('Hello Hono!'));

app.get('/users', async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.select().from(users);
  return c.json(rows);
});

app.post('/users', async (c) => {
  const db = getDb(c.env.DB);
  const { name } = await c.req.json<{ name: string }>();

  if (!name) { return c.text('name required', 400); }

  await db.insert(users).values({ name });

  return c.text('created', 201);
});

export default app;

import { Hono } from 'hono';
import { users } from '../drizzle/schema';
import dashboard from './routes/institution.routes';
import { getDb } from '../drizzle/db';

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
  const { name, email } = await c.req.json<{ name: string, email: string }>();

  if (!name && !email) { return c.text('name required', 400); }

  await db.insert(users).values({ name, email });

  return c.text('created', 201);
});

app.route('/dashboard', dashboard);

export default app;

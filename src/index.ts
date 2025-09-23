import { Hono } from 'hono';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth-middleware';

type Env = { DB: D1Database };

type Variables = {
  jwtPayload: {
    userId: string;
  };
};

const app = new Hono<{ Bindings: Env, Variables: Variables }>();

app.get('/', authMiddleware, (c) => c.text('Hello Hono!'));

app.route('/auth', authRoutes);

export default app;

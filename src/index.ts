import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth.routes';

type Env = { DB: D1Database };

type Variables = {
  jwtPayload: {
    userId: string;
  };
};

const app = new Hono<{ Bindings: Env, Variables: Variables }>();

app.use(
  '*',
  cors({
    origin: 'https://trilhainterativa.com.br',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    credentials: true,
  }),
);

app.get('/', (c) => c.text('Hello Hono!'));

app.route('/auth', authRoutes);

export default app;

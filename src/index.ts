import { Hono } from 'hono';
import authRoutes from './routes/auth.routes';

type Env = { DB: D1Database };

type Variables = {
  jwtPayload: {
    userId: string;
  };
};

const app = new Hono<{ Bindings: Env, Variables: Variables }>();

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', 'https://trilhainterativa.com.br');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Credentials', 'true');

  // Responde às requisições OPTIONS diretamente
  if (c.req.method === 'OPTIONS') {
    return new Response('', { status: 204 });
  }

  await next();
  return c.res;
});

app.get('/', (c) => c.text('Hello Hono!'));

app.route('/auth', authRoutes);

export default app;

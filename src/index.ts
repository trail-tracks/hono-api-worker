import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth.routes';
import attachmentsRoutes from './routes/attachments.routes';
import { AppBindings, AppVariables } from './types/env';
import trailsRoutes from './routes/trails.route';
import entitiesRoutes from './routes/entities.routes';
import pointsOfInterestRoutes from './routes/points-of-interest.routes';

const app = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();

app.use(
  '*',
  cors({
    origin: ['https://trilhainterativa.com.br', 'http://localhost:8081', 'http://localhost:3000'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Custom-Header',
      'Upgrade-Insecure-Requests',
    ],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    credentials: true,
  }),
);

app.get('/', (c) => c.text('Hello Hono!'));

app.route('/auth', authRoutes);
app.route('/attachments', attachmentsRoutes);
app.route('/trails', trailsRoutes);
app.route('/entities', entitiesRoutes);
app.route('/points-of-interest', pointsOfInterestRoutes);

export default app;

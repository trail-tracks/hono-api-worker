import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { registerSchema } from '../dtos/register.dto';
import { AuthController } from '../controllers/register.controller';

type Env = { DB: D1Database };

const authRoutes = new Hono<{ Bindings: Env }>();
const authController = new AuthController();

authRoutes.post(
  '/register',
  zValidator('json', registerSchema),
  authController.register.bind(authController),
);

export default authRoutes;

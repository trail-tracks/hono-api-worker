import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { RegisterDTO, registerSchema } from '../dtos/register.dto';

type Env = { DB: D1Database };

const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.post(
  '/register',
  zValidator('json', registerSchema),
  async (c) => {
    const userData: RegisterDTO = c.req.valid('json');

    return c.json({
      message: 'Usuário registrado com sucesso',
      user: {
        name: userData.name,
        email: userData.email,
      },
    });
  },
);

export default authRoutes;

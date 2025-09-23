import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { hash } from 'bcryptjs';
import { editSchema } from '../dtos/edit.dto';
import { EditEntityController } from '../controllers/edit-entity.controller';
import { LoginController } from '../controllers/login.controller';
import { loginSchema } from '../dtos/login.dto';
import { getDb } from '../../drizzle/db';
import { entity } from '../../drizzle/schema';
import { authMiddleware } from '../middlewares/auth-middleware';
import { CreateEntityDto } from '../dtos/signup.dto';
import { EntitiesController } from '../controllers/signup-entity.controller';

type Env = {
  Bindings: {
    DB: D1Database,
    JWT_SECRET: string,
  }
}

type Variables = {
  jwtPayload: {
    userId: string;
  };
};

const authRoutes = new Hono<{ Bindings: Env, Variables: Variables }>();
const editEntityController = new EditEntityController();

authRoutes.put(
  '/edit',
  authMiddleware,
  zValidator('json', editSchema),
  editEntityController.edit.bind(editEntityController),
);

const loginController = new LoginController();

authRoutes.post(
  '/login',
  zValidator('json', loginSchema),
  loginController.handle.bind(loginController),
);

// Rota de registro (signup)
authRoutes.post(
  '/signup',
  zValidator('json', CreateEntityDto),
  (c) => EntitiesController.create(c)
);

authRoutes.post('/register-entity', async (c) => {
  try {
    const data = await c.req.json();

    // Hash da senha
    const hashedPassword = await hash(data.password, 10);

    // Insere a nova entidade no banco
    await getDb(c.env.DB).insert(entity).values({
      name: data.name,
      nameComplement: data.nameComplement || null,
      email: data.email,
      password: hashedPassword,
      zipCode: data.zipCode,
      address: data.address,
      number: data.number,
      city: data.city,
      state: data.state,
      addressComplement: data.addressComplement || null,
      phone: data.phone,
    }).run();

    return c.json({ message: 'Entity registered successfully' }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default authRoutes;

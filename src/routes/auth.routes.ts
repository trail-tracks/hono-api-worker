import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { editSchema } from '../dtos/edit.dto';
import { EditEntityController } from '../controllers/edit-entity.controller';
import { LoginController } from '../controllers/login.controller';
import { loginSchema } from '../dtos/login.dto';
import { authMiddleware } from '../middlewares/auth-middleware';
import { CreateEntityDto } from '../dtos/signup.dto';
import { EntitiesController } from '../controllers/signup-entity.controller';
import { AppBindings, AppVariables } from '../types/env';

const authRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const editEntityController = new EditEntityController();
const entitiesController = new EntitiesController();

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
  entitiesController.create.bind(entitiesController),
);

export default authRoutes;

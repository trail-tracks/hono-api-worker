import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ChangeEmailController } from '../controllers/change-email.controller';
import { DeleteEntityController } from '../controllers/delete-entity.controller';
import { EditEntityController } from '../controllers/edit-entity.controller';
import { LoginController } from '../controllers/login.controller';
import { EntitiesController } from '../controllers/signup-entity.controller';
import { changeEmailSchema } from '../dtos/change-email.dto';
import { deleteSchema } from '../dtos/delete.dto';
import { editSchema } from '../dtos/edit.dto';
import { loginSchema } from '../dtos/login.dto';
import { CreateEntityDto } from '../dtos/signup.dto';
import { authMiddleware } from '../middlewares/auth-middleware';
import { AppBindings, AppVariables } from '../types/env';
import { GetEntityController } from '../controllers/get-entity.controller';

const authRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const editEntityController = new EditEntityController();
const deleteEntityController = new DeleteEntityController();
const entitiesController = new EntitiesController();
const changeEmailController = new ChangeEmailController();
const getEntityController = new GetEntityController();

authRoutes.get(
  '/',
  authMiddleware,
  getEntityController.get.bind(getEntityController),
);

authRoutes.put(
  '/edit',
  authMiddleware,
  zValidator('json', editSchema),
  editEntityController.edit.bind(editEntityController),
);

authRoutes.delete(
  '/delete',
  authMiddleware,
  zValidator('json', deleteSchema),
  deleteEntityController.delete.bind(deleteEntityController),
);

authRoutes.patch(
  '/change-email',
  authMiddleware,
  zValidator('json', changeEmailSchema),
  changeEmailController.handle.bind(changeEmailController),
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

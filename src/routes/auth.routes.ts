import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { DeleteEntityController } from '../controllers/delete-entity.controller';
import { EditEntityController } from '../controllers/edit-entity.controller';
import { LoginController } from '../controllers/login.controller';
import { EntitiesController } from '../controllers/signup-entity.controller';
import { ListEntitiesController } from '../controllers/list-entities.controller';
import { deleteSchema } from '../dtos/delete.dto';
import { editSchema } from '../dtos/edit.dto';
import { loginSchema } from '../dtos/login.dto';
import { CreateEntityDto } from '../dtos/signup.dto';
import { authMiddleware } from '../middlewares/auth-middleware';

type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
};

type Variables = {
  jwtPayload: {
    userId: string;
  };
};

const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();
const editEntityController = new EditEntityController();
const deleteEntityController = new DeleteEntityController();
const entitiesController = new EntitiesController();
const listEntitiesController = new ListEntitiesController();

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

authRoutes.get(
  '/entities',
  authMiddleware,
  listEntitiesController.list.bind(entitiesController),
);

export default authRoutes;

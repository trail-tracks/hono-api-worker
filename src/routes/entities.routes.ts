import { Hono } from 'hono';
import { ListEntitiesController } from '../controllers/list-entities.controller';
import { AppBindings, AppVariables } from '../types/env';
import { authMiddleware } from '../middlewares/auth-middleware';

const authRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const listEntitiesController = new ListEntitiesController();

authRoutes.get(
  '/',
  authMiddleware,
  listEntitiesController.list.bind(listEntitiesController),
);

export default authRoutes;

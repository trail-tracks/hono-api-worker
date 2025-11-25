import { Hono } from 'hono';
import { ListEntitiesController } from '../controllers/list-entities.controller';
import { AppBindings, AppVariables } from '../types/env';
import { authMiddleware } from '../middlewares/auth-middleware';
import { GetDashHomeController } from '../controllers/get-dash-home.controller';

const entitiesRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const listEntitiesController = new ListEntitiesController();
const getDashHomeController = new GetDashHomeController();

entitiesRoutes.get(
  '/',
  listEntitiesController.list.bind(listEntitiesController),
);

entitiesRoutes.get(
  '/home',
  authMiddleware,
  getDashHomeController.handle.bind(getDashHomeController),
);

export default entitiesRoutes;

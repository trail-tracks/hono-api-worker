import { Hono } from 'hono';
import { GetDashHomeController } from '../controllers/get-dash-home.controller';
import { GetEntityByIdController } from '../controllers/get-entity-by-id.controller';
import { ListEntitiesController } from '../controllers/list-entities.controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { AppBindings, AppVariables } from '../types/env';

const entitiesRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const listEntitiesController = new ListEntitiesController();
const getEntityByIdController = new GetEntityByIdController();
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

entitiesRoutes.get(
  '/:id',
  getEntityByIdController.get.bind(getEntityByIdController),
);

export default entitiesRoutes;

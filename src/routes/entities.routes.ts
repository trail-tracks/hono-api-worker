import { Hono } from 'hono';
import { ListEntitiesController } from '../controllers/list-entities.controller';
import { AppBindings, AppVariables } from '../types/env';

const entitiesRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();
const listEntitiesController = new ListEntitiesController();

entitiesRoutes.get(
  '/',
  listEntitiesController.list.bind(listEntitiesController),
);

export default entitiesRoutes;

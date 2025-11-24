import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { CreateTrailController } from '../controllers/create-trail.controller';
import { EditTrailController } from '../controllers/edit-trail.controller';
import { GetTrailByIdController } from '../controllers/get-trail-by-id.controller';
import { ListTrailsController } from '../controllers/list-trails.controller';
import { createTrailSchema } from '../dtos/create-trail.dto';
import { editTrailSchema } from '../dtos/edit-trail.dto';
import { authMiddleware } from '../middlewares/auth-middleware';
import { AppBindings, AppVariables } from '../types/env';

const trailsRoutes = new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();
const listTrailsController = new ListTrailsController();
const createTrailController = new CreateTrailController();
const editTrailController = new EditTrailController();
const getTrailByIdController = new GetTrailByIdController();

trailsRoutes.get(
  '/',
  authMiddleware,
  listTrailsController.list.bind(listTrailsController),
);

trailsRoutes.post(
  '/',
  authMiddleware,
  zValidator('json', createTrailSchema),
  createTrailController.create.bind(createTrailController),
);

trailsRoutes.patch(
  '/edit',
  authMiddleware,
  zValidator('json', editTrailSchema),
  editTrailController.edit.bind(editTrailController),
);

trailsRoutes.get(
  '/:entity',
  listTrailsController.list.bind(listTrailsController),
);

trailsRoutes.get(
  '/trail/:id',
  getTrailByIdController.get.bind(getTrailByIdController),
);

export default trailsRoutes;

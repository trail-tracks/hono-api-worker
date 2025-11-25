import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { CreatePointOfInterestController } from '../controllers/create-point-of-interest.controller';
import { GetPointOfInterestByIdController } from '../controllers/get-point-of-interest-by-id.controller';
import { createPointOfInterestSchema } from '../dtos/create-point-of-interest.dto';
import { authMiddleware } from '../middlewares/auth-middleware';
import { AppBindings, AppVariables } from '../types/env';

const getPointOfInterestByIdController = new GetPointOfInterestByIdController();

const pointsOfInterestRoutes = new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();

const createPointOfInterestController = new CreatePointOfInterestController();

pointsOfInterestRoutes.post(
  '/',
  authMiddleware,
  zValidator('json', createPointOfInterestSchema),
  createPointOfInterestController.create.bind(createPointOfInterestController),
);

pointsOfInterestRoutes.get(
  '/:id',
  getPointOfInterestByIdController.get.bind(getPointOfInterestByIdController),
);

export default pointsOfInterestRoutes;

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AppBindings, AppVariables } from '../types/env';
import { authMiddleware } from '../middlewares/auth-middleware';
import { CreatePointOfInterestController } from '../controllers/create-point-of-interest.controller';
import { createPointOfInterestSchema } from '../dtos/create-point-of-interest.dto';

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

export default pointsOfInterestRoutes;

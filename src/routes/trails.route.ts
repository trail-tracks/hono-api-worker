import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AppBindings, AppVariables } from "../types/env";
import { ListTrailsController } from "../controllers/list-trails.controller";
import { CreateTrailController } from "../controllers/create-trail.controller";
import { createTrailSchema } from "../dtos/create-trail.dto";
import { authMiddleware } from "../middlewares/auth-middleware";

const trailsRoutes = new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();
const listTrailsController = new ListTrailsController();
const createTrailController = new CreateTrailController();

trailsRoutes.post(
  "/",
  authMiddleware,
  zValidator("json", createTrailSchema),
  createTrailController.create.bind(createTrailController)
);

trailsRoutes.get(
  "/:entity",
  listTrailsController.list.bind(listTrailsController)
);

export default trailsRoutes;

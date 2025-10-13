import { Hono } from "hono";
import { AppBindings, AppVariables } from "../types/env";
import { ListTrailsController } from "../controllers/list-trails.controller";

const trailsRoutes = new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();
const listTrailsController = new ListTrailsController();

trailsRoutes.get(
  "/:entity",
  listTrailsController.list.bind(listTrailsController)
);

export default trailsRoutes;

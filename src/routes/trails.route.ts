import { Hono } from "hono";
import { AppBindings, AppVariables } from "../types/env";

const trailsRoutes = new Hono<{
  Bindings: AppBindings;
  Variables: AppVariables;
}>();

trailsRoutes.post("/");

export default trailsRoutes;

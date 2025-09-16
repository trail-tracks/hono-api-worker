import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { editSchema } from "../dtos/edit.dto";
import { AuthController } from "../controllers/auth.controller";

type Env = { DB: D1Database };

const authRoutes = new Hono<{ Bindings: Env }>();
const authController = new AuthController();

authRoutes.put(
  "/edit",
  zValidator("json", editSchema),
  authController.edit.bind(authController)
);

export default authRoutes;

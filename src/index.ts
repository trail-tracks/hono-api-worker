import { Hono } from "hono";
import authRoutes from "./routes/auth.routes";

type Env = { DB: D1Database };

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.text("Hello Hono!"));

app.route("/auth", authRoutes);

export default app;

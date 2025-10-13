import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth.routes";
import attachmentsRoutes from "./routes/attachments.routes";
import { AppBindings, AppVariables } from "./types/env";
import trailsRoutes from "./routes/trails.route";

const app = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();

app.use(
  "*",
  cors({
    origin: "https://trilhainterativa.com.br",
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
    ],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hello Hono!"));

app.route("/auth", authRoutes);
app.route("/attachments", attachmentsRoutes);
app.route("/trails", trailsRoutes);

export default app;

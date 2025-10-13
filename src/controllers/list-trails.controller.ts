import { Context } from "hono";
import { AppBindings } from "../types/env";
import { ListTrailsUseCase } from "../use-cases/list-trails.use-case";
import { ContentfulStatusCode } from "hono/utils/http-status";

export class ListTrailsController {
  async list(c: Context<{ Bindings: AppBindings }>) {
    try {
      const entityId = c.req.param("entity");

      const result = await ListTrailsUseCase.execute(
        c.env.DB,
        parseInt(entityId)
      );

      if (!result.success) {
        const status = (result.error?.statusCode ??
          500) as ContentfulStatusCode;
        return c.json({ error: result.error?.message }, status);
      }

      return c.json(
        {
          message: "Trilhas encontradas",
          trails: result.trails,
        },
        200
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Erro no controller de edição:", error);
      return c.json(
        {
          error: "Erro interno do servidor",
          message: "Falha na listagem das trilhas",
        },
        500
      );
    }
  }
}

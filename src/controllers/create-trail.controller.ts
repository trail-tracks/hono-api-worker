import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { CreateTrailUseCase } from "../use-cases/create-trail.use-case";
import { CreateTrailDto } from "../dtos/create-trail.dto";
import { AppBindings, AppVariables } from "../types/env";

export class CreateTrailController {
  async create(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const trailData: CreateTrailDto = await c.req.json();
      const entityId = Number(c.get("jwtPayload").userId);

      const result = await CreateTrailUseCase.execute(
        c.env.DB,
        trailData,
        entityId
      );

      if (!result.success) {
        const status = (result.error?.statusCode ??
          500) as ContentfulStatusCode;
        return c.json(
          {
            error: result.error?.message,
          },
          status
        );
      }

      return c.json(
        {
          message: "Trilha criada com sucesso",
          trail: result.trail,
        },
        201
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Erro no controller de criação de trilha:", error);

      return c.json(
        {
          error: "Erro interno do servidor",
          message: "Falha ao criar trilha",
        },
        500
      );
    }
  }
}

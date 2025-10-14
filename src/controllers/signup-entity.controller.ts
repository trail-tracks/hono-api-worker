import { Context } from "hono";
import { z } from "zod";
import { setCookie } from "hono/cookie";
import { CreateEntityDto } from "../dtos/signup.dto";
import { CreateEntityUseCase } from "../use-cases/signup.use-case";
import { AppBindings } from "../types/env";

export class EntitiesController {
  // Criar uma nova entity

  async create(c: Context<{ Bindings: AppBindings }>) {
    try {
      const entityData = await c.req.json();
      const validatedData = CreateEntityDto.parse(entityData);
      const jwtSecret = c.env.JWT_SECRET;

      const result = await CreateEntityUseCase.execute(
        c.env.DB,
        validatedData,
        jwtSecret
      );

      if (!result.success) {
        return c.json(
          {
            error: result.error,
          },
          400
        );
      }

      setCookie(c, "access_token", result.token!, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });

      return c.json(
        {
          message: "Entity criada com sucesso",
          user: result.user,
        },
        201
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Erro no controller de criação:", error);

      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: "Dados inválidos",
          },
          400
        );
      }

      return c.json(
        {
          error: "Erro interno do servidor",
          message: "Falha ao criar entity",
        },
        500
      );
    }
  }
}

import { Context } from "hono";
import { CreateEntityDto, EntityResponseDto } from "../dtos/signup.dto";
import { CreateEntityUseCase } from "../use-cases/signup.use-case";
import { z } from 'zod';

type Env = {
  Bindings: {
    DB: D1Database,
    JWT_SECRET: string,
  }
}

export class EntitiesController {
  // Criar uma nova entity

  static async create(c: Context<Env>) {
    try {
      const entityData = await c.req.json();
      const validatedData = CreateEntityDto.parse(entityData);

      const result = await CreateEntityUseCase.execute(c.env.DB, validatedData);

      if (!result.success) {
        return c.json(
          {
            error: result.error,
          },
          400,
        );
      }

      return c.json(
        {
          message: 'Entity criada com sucesso',
          entity: EntityResponseDto.parse(result.entity),
        },
        201,
      );
    } catch (error) {
      console.error('Erro no controller de criação:', error);
      
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: 'Dados inválidos',
          },
          400,
        );
      }

      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha ao criar entity',
        },
        500,
      );
    }
  }
}
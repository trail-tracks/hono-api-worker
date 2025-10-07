import { Context } from 'hono';
import { ListEntitiesUseCase } from '../use-cases/list-entities.use-case';

type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
};

export class ListEntitiesController {
  async list(c: Context<Env>) {
    try {
      const result = await ListEntitiesUseCase.execute(c.env.DB);

      if (!result.success) {
        return c.json(
          {
            error: result.error?.message,
          },
          400
        );
      }

      return c.json(
        {
          message: 'Entidades listadas com sucesso',
          entities: result.entities,
        },
        200
      );
    } catch (error) {
      console.error('Erro no controller de listagem:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha ao listar entidades',
        },
        500
      );
    }
  }
}
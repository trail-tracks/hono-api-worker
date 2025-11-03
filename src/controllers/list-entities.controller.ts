import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ListEntitiesUseCase } from '../use-cases/list-entities.use-case';
import { AppBindings } from '../types/env';

export class ListEntitiesController {
  async list(c: Context<{ Bindings: AppBindings }>) {
    try {
      const result = await ListEntitiesUseCase.execute(c.env.DB);

      if (!result.success) {
        return c.json(
          {
            error: result.error?.message,
          },
          result.error?.statusCode as ContentfulStatusCode,
        );
      }

      return c.json(
        {
          message: 'Entidades listadas com sucesso',
          entities: result.entities,
        },
        200,
      );
    } catch (error) {
      console.error('Erro no controller de listagem:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha ao listar entidades',
        },
        500,
      );
    }
  }
}

import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppBindings } from '../types/env';
import { GetEntityByIdUseCase } from '../use-cases/get-entity-by-id.use-case';

export class GetEntityByIdController {
  async get(c: Context<{ Bindings: AppBindings }>) {
    try {
      const entityId = Number(c.req.param('id'));

      if (Number.isNaN(entityId)) {
        return c.json(
          {
            error: 'ID inválido',
          },
          400,
        );
      }

      const result = await GetEntityByIdUseCase.execute(c.env.DB, entityId);

      if (!result.success) {
        const status = (result.error?.statusCode ?? 500) as ContentfulStatusCode;
        return c.json(
          {
            error: result.error?.message,
          },
          status,
        );
      }

      return c.json(
        {
          message: 'Entidade encontrada com sucesso',
          entity: result.entity,
        },
        200,
      );
    } catch (error) {
      console.error('Erro no controller de busca de entidade:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
        },
        500,
      );
    }
  }
}

import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppBindings } from '../types/env';
import { GetEntityByIdUseCase } from '../use-cases/get-entity.use-case';

export class GetEntityController {
  async get(c: Context<{ Bindings: AppBindings }>) {
    try {
      const entityId = Number(c.get('jwtPayload').userId);

      if (!entityId) {
        return c.json({ error: 'ID da entidade não informado' }, 400);
      }

      const result = await GetEntityByIdUseCase.execute(
        c.env.DB,
        entityId,
      );

      if (!result.success) {
        const status = (result.error?.statusCode
          ?? 500) as ContentfulStatusCode;
        return c.json({ error: result.error?.message }, status);
      }

      return c.json(
        {
          message: 'Entidade encontrada com sucesso',
          entity: result.entity,
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de busca da trilha:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha na busca da trilha',
        },
        500,
      );
    }
  }
}

import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppBindings } from '../types/env';
import { GetTrailByIdUseCase } from '../use-cases/get-trail-by-id.use-case';

export class GetTrailByIdController {
  async get(c: Context<{ Bindings: AppBindings }>) {
    try {
      const trailId = c.req.param('id');

      if (!trailId) {
        return c.json({ error: 'ID da trilha não informado' }, 400);
      }

      const result = await GetTrailByIdUseCase.execute(
        c.env.DB,
        parseInt(trailId, 10),
      );

      if (!result.success) {
        const status = (result.error?.statusCode
          ?? 500) as ContentfulStatusCode;
        return c.json({ error: result.error?.message }, status);
      }

      return c.json(
        {
          message: 'Trilha encontrada com sucesso',
          trail: result.trail,
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

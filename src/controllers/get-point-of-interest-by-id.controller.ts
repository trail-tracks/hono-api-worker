import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppBindings } from '../types/env';
import { GetPointOfInterestByIdUseCase } from '../use-cases/get-point-of-interest-by-id.use-case';

export class GetPointOfInterestByIdController {
  async get(c: Context<{ Bindings: AppBindings }>) {
    try {
      const pointOfInterestId = c.req.param('id');

      if (!pointOfInterestId) {
        return c.json({ error: 'ID do ponto de interesse não informado' }, 400);
      }

      const result = await GetPointOfInterestByIdUseCase.execute(
        c.env.DB,
        parseInt(pointOfInterestId, 10),
      );

      if (!result.success) {
        const status = (result.error?.statusCode
          ?? 500) as ContentfulStatusCode;
        return c.json({ error: result.error?.message }, status);
      }

      return c.json(
        {
          message: 'Ponto de interesse encontrado com sucesso',
          pointOfInterest: result.pointOfInterest,
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

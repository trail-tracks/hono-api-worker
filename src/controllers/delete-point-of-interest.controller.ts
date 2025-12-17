import { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppBindings, AppVariables } from '../types/env';
import { DeletePointOfInterestUseCase } from '../use-cases/delete-point-of-interest.use-case';

export class DeletePointOfInterestController {
  async delete(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const entityId = Number(c.get('jwtPayload').userId);
      const pointOfInterestId = Number(c.req.param('id'));

      if (Number.isNaN(pointOfInterestId)) {
        return c.json(
          { error: 'ID inválido' },
          400,
        );
      }

      const result = await DeletePointOfInterestUseCase.execute({
        d1Database: c.env.DB,
        bucket: c.env.R2_BUCKET,
        accountId: c.env.R2_ACCOUNT_ID,
        accessKeyId: c.env.R2_ACCESS_KEY_ID,
        secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
        pointOfInterestId,
        entityId,
      });

      if (result.success !== true) {
        const status = (result.error?.statusCode ?? 500) as ContentfulStatusCode;
        return c.json(
          { error: result.error?.message ?? 'Falha ao deletar o ponto de interesse.' },
          status,
        );
      }

      return c.json(
        {
          message: 'Ponto de interesse deletado com sucesso',
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao deletar o ponto de interesse:', error);

      return c.json(
        { error: 'Erro interno do servidor ao processar a solicitação.' },
        500,
      );
    }
  }
}

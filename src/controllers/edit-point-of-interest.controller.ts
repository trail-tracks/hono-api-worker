import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { EditPointOfInterestUseCase } from '../use-cases/edit-point-of-interest.use-case';
import { EditPointOfInterestDto } from '../dtos/edit-point-of-interest.dto';
import { AppBindings, AppVariables } from '../types/env';

export class EditPointOfInterestController {
  async edit(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const pointData: EditPointOfInterestDto = await c.req.json();
      const entityId = Number(c.get('jwtPayload').userId);
      const pointOfInterestId = Number(c.req.param('id'));

      const result = await EditPointOfInterestUseCase.execute(
        c.env.DB,
        pointData,
        entityId,
        pointOfInterestId
      );

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
          message: 'Ponto de interesse criado com sucesso',
          pointOfInterest: result.pointOfInterest,
        },
        201,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de criação de ponto de interesse:', error);

      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha ao criar ponto de interesse',
        },
        500,
      );
    }
  }
}

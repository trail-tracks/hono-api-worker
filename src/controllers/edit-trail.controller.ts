import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppBindings, AppVariables } from '../types/env';
import { EditTrailUseCase } from '../use-cases/edit-trail.use-case';
import { EditTrailDto } from '../dtos/edit-trail.dto';

export class EditTrailController {
  async edit(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const trailData: EditTrailDto = await c.req.json();
      const entityId = Number(c.get('jwtPayload').userId);

      const result = await EditTrailUseCase.execute(
        c.env.DB,
        trailData,
        entityId,
      );

      if (!result.success) {
        const status = (result.error?.statusCode
          ?? 500) as ContentfulStatusCode;
        return c.json(
          {
            error: result.error?.message,
          },
          status,
        );
      }

      return c.json(
        {
          message: 'Trilha editada com sucesso',
          trail: result.trail,
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de edição de trilha:', error);

      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha ao editar trilha',
        },
        500,
      );
    }
  }
}

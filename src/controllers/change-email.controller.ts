import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ChangeEmailDTO } from '../dtos/change-email.dto';
import { AppBindings, AppVariables } from '../types/env';
import { ChangeEmailUseCase } from '../use-cases/change-email.use-case';

export class ChangeEmailController {
  async handle(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const changeEmailData: ChangeEmailDTO = await c.req.json();
      const entityId = Number(c.get('jwtPayload').userId);

      const result = await ChangeEmailUseCase.execute(
        c.env.DB,
        changeEmailData,
        entityId,
      );

      if (!result.success) {
        return c.json(
          {
            error: result.error?.message,
          },
          (result.error?.statusCode || 400) as ContentfulStatusCode,
        );
      }

      return c.json(
        {
          message: 'Email alterado com sucesso',
          entity: result.entity,
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de alteração de email:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
        },
        500,
      );
    }
  }
}

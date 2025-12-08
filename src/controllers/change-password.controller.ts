import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ChangePasswordDTO } from '../dtos/change-password.dto';
import { AppBindings, AppVariables } from '../types/env';
import { ChangePasswordUseCase } from '../use-cases/change-password.use-case';

export class ChangePasswordController {
  async handle(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const changePasswordData: ChangePasswordDTO = await c.req.json();
      const entityId = Number(c.get('jwtPayload').userId);

      const result = await ChangePasswordUseCase.execute(
        c.env.DB,
        changePasswordData,
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
          message: 'Senha alterada com sucesso',
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de alteração de Password:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
        },
        500,
      );
    }
  }
}

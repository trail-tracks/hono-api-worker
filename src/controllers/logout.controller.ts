import { Context } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { AppBindings, AppVariables } from '../types/env';
import { LogoutUseCase } from '../use-cases/logout.use-case';

export class LogoutController {
  async handle(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const result = await LogoutUseCase.execute();

      deleteCookie(c, 'access_token', {
        path: '/',
      });

      return c.json(
        {
          message: result.message,
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de logout:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
        },
        500,
      );
    }
  }
}

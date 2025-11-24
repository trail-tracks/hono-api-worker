import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { GetDashHomeUseCase } from '../use-cases/get-dash-home.use-case';
import { AppBindings, AppVariables } from '../types/env';

export class GetDashHomeController {
  async handle(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    try {
      const jwtPayload = c.get('jwtPayload');

      if (!jwtPayload || !jwtPayload.userId) {
        return c.json(
          { error: 'Usuário não autenticado ou token inválido.' },
          401,
        );
      }

      const entityId = Number(jwtPayload.userId);

      const result = await GetDashHomeUseCase.execute(c.env.DB, entityId);

      if (!result.success) {
        const status = (result.error?.statusCode ?? 500) as ContentfulStatusCode;
        return c.json(
          {
            error: result.error?.message ?? 'Erro ao buscar dados da dashboard.',
          },
          status,
        );
      }

      return c.json(result.data, 200);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller da dashboard:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha ao carregar a dashboard',
        },
        500,
      );
    }
  }
}

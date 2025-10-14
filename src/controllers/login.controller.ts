import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoginDTO } from '../dtos/login.dto';
import { AppBindings } from '../types/env';

export class LoginController {
  async handle(c: Context<{ Bindings: AppBindings }>) {
    try {
      const jwtSecret = c.env.JWT_SECRET;
      const loginData: LoginDTO = await c.req.json();

      const result = await LoginUseCase.execute(c.env.DB, loginData, jwtSecret);

      if (!result.success) {
        return c.json(
          {
            error: result.error,
          },
          result.error?.statusCode as ContentfulStatusCode,
        );
      }

      setCookie(c, 'access_token', result.token!, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });

      return c.json(
        {
          message: 'Usuário logado com sucesso',
          user: result.user,
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de login:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha no login do usuário',
        },
        500,
      );
    }
  }
}

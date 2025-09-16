import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { LoginUseCase } from '../use-cases/login.use-case';
import { LoginDTO } from '../dtos/login.dto';

type Env = {
  Bindings: {
    DB: D1Database,
    JWT_SECRET: string,
  }
}

export class LoginController {
  async handle(c: Context<Env>) {
    try {
      const jwtSecret = c.env.JWT_SECRET;
      const loginData: LoginDTO = await c.req.json();

      const result = await LoginUseCase.execute(c.env.DB, loginData, jwtSecret);

      if (!result.success) {
        return c.json(
          {
            error: result.error,
          },
          400,
        );
      }

      setCookie(c, 'access_token', result.token!);

      return c.json(
        {
          message: 'Usuário logado com sucesso',
          user: result.user,
        },
        200,
      );
    } catch (error) {
      console.error('Erro no controller de registro:', error);
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

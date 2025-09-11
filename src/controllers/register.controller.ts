import { Context } from 'hono';
import { RegisterDTO } from '../dtos/register.dto';
import { RegisterUserUseCase } from '../use-cases/register.use-case';

type Env = {
  Bindings: { DB: D1Database }
}

export class AuthController {
  async register(c: Context<Env>) {
    try {
      const userData: RegisterDTO = await c.req.json();

      const result = await RegisterUserUseCase.execute(c.env.DB, userData);

      if (!result.success) {
        return c.json(
          {
            error: result.error,
            message: 'Falha no registro do usuário',
          },
          400,
        );
      }

      return c.json(
        {
          message: 'Usuário registrado com sucesso',
          user: result.user,
        },
        201,
      );
    } catch (error) {
      console.error('Erro no controller de registro:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha no registro do usuário',
        },
        500,
      );
    }
  }
}

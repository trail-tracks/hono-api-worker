import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { sign } from 'hono/jwt';
import { getDb } from '../../drizzle/db';
import { entity } from '../../drizzle/schema';
import { LoginDTO } from '../dtos/login.dto';

export interface LoginUseCaseResponse {
  success: boolean
  user?: {
    id: number
    name: string
    email: string
  }
  token?: string;
  error?: {
    message: string
    statusCode: number
  }
}

export class LoginUseCase {
  static async execute(
    d1Database: D1Database,
    loginData: LoginDTO,
    jwtSecret: string,
  ): Promise<LoginUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      const existingUser = await db
        .select()
        .from(entity)
        .where(eq(entity.email, loginData.email))
        .get();

      if (!existingUser) {
        return {
          success: false,
          error: {
            message: 'Credenciais Inválidas',
            statusCode: 401,
          },
        };
      }

      const passwordMatches = await compare(loginData.password, existingUser.password);

      if (!passwordMatches) {
        return {
          success: false,
          error: {
            message: 'Credenciais Inválidas',
            statusCode: 401,
          },
        };
      }

      const payload = {
        sub: existingUser.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
      };

      const token = await sign(payload, jwtSecret);

      console.log(jwtSecret);

      return {
        success: true,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: `Erro interno do servidor: ${error}`,
          statusCode: 400,
        },
      };
    }
  }
}

import { compare } from "bcryptjs";
import { and, eq, isNull, like } from "drizzle-orm";
import { sign } from "hono/jwt";
import { getDb } from "../../drizzle/db";
import { attachment, entity } from "../../drizzle/schema";
import { LoginDTO } from "../dtos/login.dto";

export interface LoginUseCaseResponse {
  success: boolean;
  user?: {
    name: string;
    nameComplement: string | null;
    coverUrl: string | null;
  };
  token?: string;
  error?: {
    message: string;
    statusCode: number;
  };
}

export class LoginUseCase {
  static async execute(
    d1Database: D1Database,
    loginData: LoginDTO,
    jwtSecret: string
  ): Promise<LoginUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      const existingUser = await db
        .select()
        .from(entity)
        .where(and(eq(entity.email, loginData.email), isNull(entity.deletedAt)))
        .get();

      if (!existingUser) {
        return {
          success: false,
          error: {
            message: "Credenciais Inválidas",
            statusCode: 401,
          },
        };
      }

      const passwordMatches = await compare(
        loginData.password,
        existingUser.password
      );

      if (!passwordMatches) {
        return {
          success: false,
          error: {
            message: "Credenciais Inválidas",
            statusCode: 401,
          },
        };
      }

      const entityCover = await db
        .select()
        .from(attachment)
        .where(
          and(
            eq(attachment.entityId, existingUser.id),
            like(attachment.url, "%/cover/%")
          )
        )
        .get();

      const payload = {
        sub: existingUser.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
      };

      const token = await sign(payload, jwtSecret);

      return {
        success: true,
        user: {
          name: existingUser.name,
          nameComplement: existingUser.nameComplement,
          coverUrl: entityCover?.url || null,
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

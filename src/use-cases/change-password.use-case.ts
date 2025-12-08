import { compare, hash } from 'bcryptjs';
import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { entity } from '../../drizzle/schema';
import { ChangePasswordDTO } from '../dtos/change-password.dto';

export interface ChangePasswordUseCaseResponse {
  success: boolean;
  error?: {
    message: string;
    statusCode: number;
  };
}

export class ChangePasswordUseCase {
  static async execute(
    d1Database: D1Database,
    changePasswordData: ChangePasswordDTO,
    entityId: number,
  ): Promise<ChangePasswordUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      const existingEntity = await db
        .select()
        .from(entity)
        .where(and(eq(entity.id, entityId), isNull(entity.deletedAt)))
        .get();

      if (!existingEntity) {
        return {
          success: false,
          error: {
            message: 'Entidade não encontrada ou foi excluída',
            statusCode: 404,
          },
        };
      }

      const passwordMatches = await compare(
        changePasswordData.password,
        existingEntity.password,
      );

      if (!passwordMatches) {
        return {
          success: false,
          error: {
            message: 'Senha incorreta',
            statusCode: 401,
          },
        };
      }

      // Hash da senha
      const hashedPassword = await hash(changePasswordData.newPassword, 12);

      await db
        .update(entity)
        .set({
          password: hashedPassword,
        })
        .where(eq(entity.id, entityId))

      return {
        success: true,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao alterar senha:', error);
      return {
        success: false,
        error: {
          message: 'Erro interno do servidor',
          statusCode: 500,
        },
      };
    }
  }
}

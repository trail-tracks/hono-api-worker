import { compare } from 'bcryptjs';
import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { entity } from '../../drizzle/schema';
import { ChangeEmailDTO } from '../dtos/change-email.dto';

export interface ChangeEmailUseCaseResponse {
  success: boolean;
  entity?: {
    id: number;
    email: string;
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

export class ChangeEmailUseCase {
  static async execute(
    d1Database: D1Database,
    changeEmailData: ChangeEmailDTO,
    entityId: number,
  ): Promise<ChangeEmailUseCaseResponse> {
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
        changeEmailData.password,
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

      const emailExists = await db
        .select()
        .from(entity)
        .where(
          and(
            eq(entity.email, changeEmailData.newEmail),
            isNull(entity.deletedAt),
          ),
        )
        .get();

      if (emailExists) {
        return {
          success: false,
          error: {
            message: 'Este email já está em uso',
            statusCode: 400,
          },
        };
      }

      const [updatedEntity] = await db
        .update(entity)
        .set({
          email: changeEmailData.newEmail,
        })
        .where(eq(entity.id, entityId))
        .returning({
          id: entity.id,
          email: entity.email,
        });

      return {
        success: true,
        entity: updatedEntity,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao alterar email:', error);
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

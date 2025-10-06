import { eq } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { entity } from '../../drizzle/schema';
import { DeleteDTO } from '../dtos/delete.dto';

export interface DeleteEntityUseCaseResponse {
  success: boolean;
  entity?: {
    id: number;
    name: string;
  };
  error?: string;
}

export class DeleteEntityUseCase {
  static async execute(
    d1Database: D1Database,
    entityData: DeleteDTO,
  ): Promise<DeleteEntityUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      // Verificar se a entidade existe e não foi deletada
      const existingEntity = await db
        .select()
        .from(entity)
        .where(eq(entity.id, entityData.id))
        .get();

      if (existingEntity === undefined) {
        return {
          success: false,
          error: 'Entidade não encontrada',
        };
      }

      if (existingEntity.deletedAt) {
        return {
          success: false,
          error: 'Entidade já foi excluída',
        };
      }

      // Realizar soft delete
      const [deletedEntity] = await db
        .update(entity)
        .set({
          deletedAt: new Date().toISOString(),
        })
        .where(eq(entity.id, entityData.id))
        .returning({
          id: entity.id,
          name: entity.name,
        });

      return {
        success: true,
        entity: deletedEntity,
      };
    } catch {
      return {
        success: false,
        error: 'Erro interno do servidor',
      };
    }
  }
}

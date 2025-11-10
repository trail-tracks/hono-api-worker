import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { trail, entity } from '../../drizzle/schema';
import { CreateTrailDto } from '../dtos/create-trail.dto';

export interface CreateTrailUseCaseResponse {
  success: boolean;
  trail?: {
    id: number;
    name: string;
    description: string | null;
    shortDescription: string | null;
    duration: number | null;
    distance: number | null;
    difficulty: string | null;
    entityId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

export class CreateTrailUseCase {
  static async execute(
    d1Database: D1Database,
    trailData: CreateTrailDto,
    entityId: number,
  ): Promise<CreateTrailUseCaseResponse> {
    const db = getDb(d1Database);

    try {
      // Verificar se a entidade existe e não foi deletada
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

      // Criar a trilha
      const newTrail = await db
        .insert(trail)
        .values({
          name: trailData.name,
          description: trailData.description,
          shortDescription: trailData.shortDescription,
          duration: trailData.duration,
          distance: trailData.distance,
          difficulty: trailData.difficulty,
          safetyTips: trailData.safetyTips,
          entityId,
        })
        .returning()
        .get();

      return {
        success: true,
        trail: newTrail,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao criar trilha:', error);

      return {
        success: false,
        error: {
          message: 'Erro interno do servidor ao criar trilha',
          statusCode: 500,
        },
      };
    }
  }
}

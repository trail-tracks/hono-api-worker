import { and, eq } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { trail } from '../../drizzle/schema';
import { EditTrailDto } from '../dtos/edit-trail.dto';

export interface EditTrailUseCaseResponse {
  success: boolean;
  trail?: {
    id: number;
    name: string;
    description: string | null;
    shortDescription: string | null;
    duration: string | null;
    distance: string | null;
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

export class EditTrailUseCase {
  static async execute(
    d1Database: D1Database,
    trailData: EditTrailDto,
    entityId: number,
  ): Promise<EditTrailUseCaseResponse> {
    const db = getDb(d1Database);

    try {
      // Verificar se a trilha existe e não foi deletada
      const existingTrail = await db
        .select()
        .from(trail)
        .where(and(eq(trail.id, trailData.id), eq(trail.entityId, entityId)))
        .get();

      if (!existingTrail) {
        return {
          success: false,
          error: {
            message: 'Trilha não encontrada ou foi excluída',
            statusCode: 404,
          },
        };
      }

      // Editar a trilha
      const updatedTrail = await db
        .update(trail)
        .set({
          name: trailData.name,
          description: trailData.description,
          shortDescription: trailData.shortDescription,
          duration: String(trailData.duration),
          distance: String(trailData.distance),
          difficulty: trailData.difficulty,
          safetyTips: trailData.safetyTips,
        })
        .where(and(eq(trail.id, trailData.id), eq(trail.entityId, entityId)))
        .returning()
        .get();

      return {
        success: true,
        trail: updatedTrail,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao editar trilha:', error);

      return {
        success: false,
        error: {
          message: 'Erro interno do servidor ao editar trilha',
          statusCode: 500,
        },
      };
    }
  }
}

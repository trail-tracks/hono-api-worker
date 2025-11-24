import {
  and, eq, isNull, like,
} from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, entity, trail } from '../../drizzle/schema';
import { CreatePointOfInterestUseCase } from './create-point-of-interest.use-case';

export interface ListTrailsUseCaseResponse {
  success: boolean;
  trails?: {
    id: number;
    name: string;
    description: string | null;
    shortDescription: string | null;
    duration: string | null;
    distance: string | null;
    difficulty: string | null;
    coverUrl?: string | null;
  }[];
  error?: {
    message: string;
    statusCode: number;
  };
}

export class ListTrailsUseCase {
  static async execute(
    d1Database: D1Database,
    id: number,
  ): Promise<ListTrailsUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      // Verificar se a entidade existe e não foi deletada
      const existingEntity = await db
        .select()
        .from(entity)
        .where(and(eq(entity.id, id), isNull(entity.deletedAt)))
        .get();

      if (existingEntity === undefined) {
        return {
          success: false,
          error: {
            message: 'Entidade não encontrada ou foi excluída',
            statusCode: 404,
          },
        };
      }

      const trailsList = await db
        .select({
          id: trail.id,
          name: trail.name,
          description: trail.description,
          shortDescription: trail.shortDescription,
          duration: trail.duration,
          distance: trail.distance,
          difficulty: trail.difficulty,
          safetyTips: trail.safetyTips,
          coverUrl: attachment.url,
        })
        .from(trail)
        .leftJoin(
          attachment,
          and(
            eq(trail.id, attachment.trailId),
            like(attachment.url, '%/cover/%'),
          ),
        )
        .where(eq(trail.entityId, id));

      return {
        success: true,
        trails: trailsList,
      };
    } catch (error) {
      console.log(error);
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

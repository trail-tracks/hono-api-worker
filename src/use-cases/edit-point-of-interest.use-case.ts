import { and, eq } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { pointOfInterest, trail } from '../../drizzle/schema';
import { EditPointOfInterestDto } from '../dtos/edit-point-of-interest.dto';

export interface EditPointOfInterestUseCaseResponse {
  success: boolean;
  pointOfInterest?: {
    id: number;
    name: string;
    description: string | null;
    shortDescription: string | null;
    trailId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

export class EditPointOfInterestUseCase {
  static async execute(
    d1Database: D1Database,
    pointData: EditPointOfInterestDto,
    entityId: number,
    pointId: number
  ): Promise<EditPointOfInterestUseCaseResponse> {
    const db = getDb(d1Database);

    try {
      // Verificar se o ponto de interesse existe e pertence à entidade através da trail
      const existingPoint = await db
        .select({
          id: pointOfInterest.id,
          name: pointOfInterest.name,
          description: pointOfInterest.description,
          shortDescription: pointOfInterest.shortDescription,
          trailId: pointOfInterest.trailId,
          createdAt: pointOfInterest.createdAt,
          updatedAt: pointOfInterest.updatedAt,
        })
        .from(pointOfInterest)
        .innerJoin(trail, eq(pointOfInterest.trailId, trail.id))
        .where(and(eq(pointOfInterest.id, pointId), eq(trail.entityId, entityId)))
        .get();

      if (!existingPoint) {
        return {
          success: false,
          error: {
            message: 'Ponto de interesse não encontrado ou não pertence a esta entidade',
            statusCode: 404,
          },
        };
      }

      // Editar o ponto de interesse
      const updatedPoint = await db
        .update(pointOfInterest)
        .set({
          name: pointData.name,
          description: pointData.description,
          shortDescription: pointData.shortDescription,
        })
        .where(eq(pointOfInterest.id, pointId))
        .returning()
        .get();

      return {
        success: true,
        pointOfInterest: updatedPoint,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao editar ponto de interesse:', error);

      return {
        success: false,
        error: {
          message: 'Erro interno do servidor ao editar ponto de interesse',
          statusCode: 500,
        },
      };
    }
  }
}

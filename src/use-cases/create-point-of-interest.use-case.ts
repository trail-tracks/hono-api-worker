import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { pointOfInterest, trail, entity } from '../../drizzle/schema';
import { CreatePointOfInterestDto } from '../dtos/create-point-of-interest.dto';

export interface CreatePointOfInterestUseCaseResponse {
  success: boolean;
  pointOfInterest?: {
    id: number;
    name: string;
    shortDescription: string;
    description: string | null;
    trailId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

export class CreatePointOfInterestUseCase {
  static async execute(
    d1Database: D1Database,
    pointData: CreatePointOfInterestDto,
    entityId: number,
  ): Promise<CreatePointOfInterestUseCaseResponse> {
    const db = getDb(d1Database);

    try {
      // Verificar se a trilha existe e pertence à entidade autenticada
      const existingTrail = await db
        .select()
        .from(trail)
        .where(eq(trail.id, pointData.trailId))
        .get();

      if (!existingTrail) {
        return {
          success: false,
          error: {
            message: 'Trilha não encontrada',
            statusCode: 404,
          },
        };
      }

      // Verificar se a trilha pertence à entidade autenticada
      if (existingTrail.entityId !== entityId) {
        return {
          success: false,
          error: {
            message: 'Você não tem permissão para adicionar pontos de interesse nesta trilha',
            statusCode: 403,
          },
        };
      }

      // Criar o ponto de interesse
      const newPointOfInterest = await db
        .insert(pointOfInterest)
        .values({
          name: pointData.name,
          shortDescription: pointData.shortDescription,
          description: pointData.description,
          trailId: pointData.trailId,
        })
        .returning()
        .get();

      return {
        success: true,
        pointOfInterest: newPointOfInterest,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao criar ponto de interesse:', error);

      return {
        success: false,
        error: {
          message: 'Erro interno do servidor ao criar ponto de interesse',
          statusCode: 500,
        },
      };
    }
  }
}

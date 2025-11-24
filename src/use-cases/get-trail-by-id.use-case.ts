import { and, eq, like } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, trail } from '../../drizzle/schema';

export interface GetTrailByIdUseCaseResponse {
  success: boolean;
  trail?: {
    id: number;
    name: string;
    description: string | null;
    shortDescription: string | null;
    duration: number | null;
    distance: number | null;
    difficulty: string | null;
    safetyTips: string | null;
    coverUrl: string | null;
    gallery: {
      id: number;
      url: string | null;
      uuid: string;
    }[];
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

export class GetTrailByIdUseCase {
  static async execute(
    d1Database: D1Database,
    trailId: number,
  ): Promise<GetTrailByIdUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      // Buscar a trilha
      const trailData = await db
        .select({
          id: trail.id,
          name: trail.name,
          description: trail.description,
          shortDescription: trail.shortDescription,
          duration: trail.duration,
          distance: trail.distance,
          difficulty: trail.difficulty,
          safetyTips: trail.safetyTips,
        })
        .from(trail)
        .where(eq(trail.id, trailId))
        .get();

      if (!trailData) {
        return {
          success: false,
          error: {
            message: 'Trilha não encontrada',
            statusCode: 404,
          },
        };
      }

      // Buscar a foto de capa (cover)
      const coverImage = await db
        .select({
          url: attachment.url,
        })
        .from(attachment)
        .where(
          and(
            eq(attachment.trailId, trailId),
            like(attachment.url, '%/cover/%'),
          ),
        )
        .get();

      // Buscar as imagens da galeria
      const galleryImages = await db
        .select({
          id: attachment.id,
          url: attachment.url,
          uuid: attachment.uuid,
        })
        .from(attachment)
        .where(
          and(
            eq(attachment.trailId, trailId),
            like(attachment.url, '%/galery/%'),
          ),
        );

      return {
        success: true,
        trail: {
          ...trailData,
          coverUrl: coverImage?.url || null,
          gallery: galleryImages,
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
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

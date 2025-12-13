import { and, eq, like } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, pointOfInterest, trail } from '../../drizzle/schema';

export interface GetTrailByIdUseCaseResponse {
  success: boolean;
  trail?: {
    id: number;
    name: string;
    description?: string;
    shortDescription: string;
    duration: string;
    distance: string;
    difficulty: string;
    safetyTips?: string;
    coverUrl?: string;
    gallery: {
      id: number;
      url: string | null;
      uuid: string;
    }[];
    pointsOfInterest: {
      id: number;
      name: string;
      shortDescription: string;
      description: string | null;
      trailId: number;
      createdAt: Date | null;
      updatedAt: Date | null;
      coverUrl?: string;
      gallery: {
        id: number;
        url: string | null;
        uuid: string;
      }[];
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
      const trailData = await db
        .select({
          id: trail.id,
          name: trail.name,
          description: trail.description ?? null,
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
            like(attachment.url, '%/gallery/%'),
          ),
        );

      const pointsOfInterestData = await db
        .select({
          id: pointOfInterest.id,
          name: pointOfInterest.name,
          shortDescription: pointOfInterest.shortDescription,
          description: pointOfInterest.description ?? null,
          trailId: pointOfInterest.trailId,
          createdAt: pointOfInterest.createdAt,
          updatedAt: pointOfInterest.updatedAt,
        })
        .from(pointOfInterest)
        .where(eq(pointOfInterest.trailId, trailId));

      // Buscar fotos de cada ponto de interesse
      const pointsOfInterestWithPhotos = await Promise.all(
        pointsOfInterestData.map(async (poi) => {
          // Buscar foto de capa do ponto de interesse
          const poiCover = await db
            .select({
              url: attachment.url,
            })
            .from(attachment)
            .where(
              and(
                eq(attachment.pointOfInterestId, poi.id),
                like(attachment.url, '%/cover/%'),
              ),
            )
            .get();

          // Buscar galeria do ponto de interesse
          const poiGallery = await db
            .select({
              id: attachment.id,
              url: attachment.url,
              uuid: attachment.uuid,
            })
            .from(attachment)
            .where(
              and(
                eq(attachment.pointOfInterestId, poi.id),
                like(attachment.url, '%/galery/%'),
              ),
            );

          return {
            ...poi,
            coverUrl: poiCover?.url ?? undefined,
            gallery: poiGallery,
          };
        }),
      );

      return {
        success: true,
        trail: {
          id: trailData.id,
          name: trailData.name,
          description: trailData.description ?? undefined,
          shortDescription: trailData.shortDescription,
          duration: trailData.duration,
          distance: trailData.distance,
          difficulty: trailData.difficulty,
          safetyTips: trailData.safetyTips ?? undefined,
          coverUrl: coverImage?.url ?? undefined,
          gallery: galleryImages,
          pointsOfInterest: pointsOfInterestWithPhotos,
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

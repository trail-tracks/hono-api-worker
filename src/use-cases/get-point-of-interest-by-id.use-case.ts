import { and, eq, like } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, pointOfInterest } from '../../drizzle/schema';

export interface GetPointOfInterestByIdUseCaseResponse {
  success: boolean;
  pointOfInterest?: {
    id: number;
    name: string;
    description: string | null;
    shortDescription: string;
    trailId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    coverUrl?: string;
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

export class GetPointOfInterestByIdUseCase {
  static async execute(
    d1Database: D1Database,
    pointOfInterestId: number,
  ): Promise<GetPointOfInterestByIdUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      const pointOfInterestData = await db
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
        .where(eq(pointOfInterest.id, pointOfInterestId))
        .get();

      if (!pointOfInterestData) {
        return {
          success: false,
          error: {
            message: 'Ponto de interesse não encontrado',
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
            eq(attachment.pointOfInterestId, pointOfInterestId),
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
            eq(attachment.pointOfInterestId, pointOfInterestId),
            like(attachment.url, '%/galery/%'),
          ),
        );

      const pointsOfInterestWithPhotos = {
        ...pointOfInterestData,
        coverUrl: coverImage?.url ?? undefined,
        gallery: galleryImages,
      };

      return {
        success: true,
        pointOfInterest: {
          id: pointsOfInterestWithPhotos.id,
          name: pointsOfInterestWithPhotos.name,
          trailId: pointsOfInterestWithPhotos.trailId,
          createdAt: pointsOfInterestWithPhotos.createdAt,
          updatedAt: pointsOfInterestWithPhotos.updatedAt,
          description: pointsOfInterestWithPhotos.description,
          shortDescription: pointsOfInterestWithPhotos.shortDescription,
          coverUrl: pointsOfInterestWithPhotos.coverUrl,
          gallery: pointsOfInterestWithPhotos.gallery,
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

import { and, eq, like } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, entity } from '../../drizzle/schema';

export interface GetEntityByIdUseCaseResponse {
  success: boolean;
  entity?: {
    id: number;
    name: string;
    nameComplement: string | null;
    zipCode: string | null;
    address: string | null;
    number: string | null;
    city: string | null;
    state: string | null;
    addressComplement: string | null;
    phone: string | null;
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

export class GetEntityByIdUseCase {
  static async execute(
    d1Database: D1Database,
    entityId: number,
  ): Promise<GetEntityByIdUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      const entityData = await db
        .select({
          id: entity.id,
          name: entity.name,
          nameComplement: entity.nameComplement,
          zipCode: entity.zipCode,
          address: entity.address,
          number: entity.number,
          city: entity.city,
          state: entity.state,
          addressComplement: entity.addressComplement,
          phone: entity.phone,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        })
        .from(entity)
        .where(eq(entity.id, entityId))
        .get();

      if (!entityData) {
        return {
          success: false,
          error: {
            message: 'Entidade não encontrada',
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
            eq(attachment.entityId, entityId),
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
            eq(attachment.entityId, entityId),
            like(attachment.url, '%/galery/%'),
          ),
        );

      const entityWithPhotos = {
        ...entityData,
        coverUrl: coverImage?.url ?? undefined,
        gallery: galleryImages,
      };

      return {
        success: true,
        entity: {
          id: entityWithPhotos.id,
          name: entityWithPhotos.name,
          nameComplement: entityWithPhotos.nameComplement,
          zipCode: entityWithPhotos.zipCode,
          address: entityWithPhotos.address,
          number: entityWithPhotos.number,
          city: entityWithPhotos.city,
          state: entityWithPhotos.state,
          addressComplement: entityWithPhotos.addressComplement,
          phone: entityWithPhotos.phone,
          createdAt: entityWithPhotos.createdAt,
          updatedAt: entityWithPhotos.updatedAt,
          coverUrl: entityWithPhotos.coverUrl,
          gallery: entityWithPhotos.gallery,
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

import {
  and, eq, isNull,
} from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, entity } from '../../drizzle/schema';

export interface GetEntityByIdUseCaseResponse {
  success: boolean;
  entity?: {
    id: number;
    name: string;
    email: string;
    zipCode: string;
    address: string;
    number: string;
    city: string;
    state: string;
    phone: string;
    nameComplement?: string | null;
    addressComplement?: string | null;
    coverUrl: string | null;
    posterUrl: string | null;
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
      const result = await db
        .select({
          id: entity.id,
          name: entity.name,
          email: entity.email,
          zipCode: entity.zipCode,
          address: entity.address,
          number: entity.number,
          city: entity.city,
          state: entity.state,
          phone: entity.phone,
          nameComplement: entity.nameComplement,
          addressComplement: entity.addressComplement,
        })
        .from(entity)
        .where(and(eq(entity.id, entityId), isNull(entity.deletedAt)))
        .get();

      if (!result) {
        return {
          success: false,
          error: {
            message: 'Entidade não encontrada',
            statusCode: 404,
          },
        };
      }

      // Buscar cover
      const coverResult = await db
        .select({
          url: attachment.url,
        })
        .from(attachment)
        .where(
          and(
            eq(attachment.entityId, entityId),
            eq(attachment.type, 'cover'),
          ),
        )
        .get();

      // Buscar poster
      const posterResult = await db
        .select({
          url: attachment.url,
        })
        .from(attachment)
        .where(
          and(
            eq(attachment.entityId, entityId),
            eq(attachment.type, 'poster'),
          ),
        )
        .get();

      return {
        success: true,
        entity: {
          ...result,
          coverUrl: coverResult?.url ?? null,
          posterUrl: posterResult?.url ?? null,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar entidade:', error);
      return {
        success: false,
        error: {
          message: 'Erro interno do servidor ao buscar entidade',
          statusCode: 500,
        },
      };
    }
  }
}

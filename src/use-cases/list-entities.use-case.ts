import {
  and, eq, isNull, like,
} from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, entity } from '../../drizzle/schema';

export interface ListEntitiesUseCaseResponse {
  success: boolean;
  entities?: Array<{
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
  }>;
  error?: {
    message: string;
    statusCode: number;
  };
}

export class ListEntitiesUseCase {
  static async execute(d1Database: D1Database): Promise<ListEntitiesUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      const results = await db
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
          coverUrl: attachment.url,
        })
        .from(entity)
        .leftJoin(
          attachment,
          and(
            eq(entity.id, attachment.entityId),
            eq(attachment.type, 'cover'),
          ),
        )
        .where(isNull(entity.deletedAt))
        .all();

      const posterResults = await db
        .select({
          entityId: attachment.entityId,
          posterUrl: attachment.url,
        })
        .from(attachment)
        .where(eq(attachment.type, 'poster'))
        .all();

      const posterMap = new Map(
        posterResults.map((p) => [p.entityId, p.posterUrl]),
      );

      const entities = results.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        zipCode: e.zipCode,
        address: e.address,
        number: e.number,
        city: e.city,
        state: e.state,
        phone: e.phone,
        nameComplement: e.nameComplement,
        addressComplement: e.addressComplement,
        coverUrl: e.coverUrl,
        posterUrl: posterMap.get(e.id) ?? null,
      }));

      return {
        success: true,
        entities,
      };
    } catch (error) {
      console.error('Erro ao listar entidades:', error);
      return {
        success: false,
        error: {
          message: 'Erro interno do servidor ao listar entidades',
          statusCode: 500,
        },
      };
    }
  }
}

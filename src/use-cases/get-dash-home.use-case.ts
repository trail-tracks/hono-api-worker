import { D1Database } from '@cloudflare/workers-types';
import {
  and, count, desc, eq, like,
} from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, pointOfInterest, trail } from '../../drizzle/schema';

export interface GetDashHomeUseCaseResponse {
  success: boolean;
  data?: {
    trailsCount: number;
    poisCount: number;
    lastTrails: {
      id: number;
      name: string;
      distance: string;
      difficulty: string;
      duration: string;
      coverUrl: string | null;
    }[];
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

export class GetDashHomeUseCase {
  static async execute(
    d1Database: D1Database,
    entityId: number,
  ): Promise<GetDashHomeUseCaseResponse> {
    const db = getDb(d1Database);

    try {
      const [trailsCountResult] = await db
        .select({ value: count() })
        .from(trail)
        .where(eq(trail.entityId, entityId));

      const [poisCountResult] = await db
        .select({ value: count() })
        .from(pointOfInterest)
        .innerJoin(trail, eq(pointOfInterest.trailId, trail.id))
        .where(eq(trail.entityId, entityId));

      const lastTrails = await db
        .select({
          id: trail.id,
          name: trail.name,
          distance: trail.distance,
          duration: trail.duration,
          difficulty: trail.difficulty,
          coverUrl: attachment.url,
        })
        .from(trail)
        .leftJoin(
          attachment,
          and(
            eq(attachment.trailId, trail.id),
            like(attachment.url, '%/cover/%'),
          ),
        )
        .where(eq(trail.entityId, entityId))
        .orderBy(desc(trail.createdAt))
        .limit(2);

      return {
        success: true,
        data: {
          trailsCount: trailsCountResult?.value || 0,
          poisCount: poisCountResult?.value || 0,
          lastTrails: lastTrails.map((t) => ({
            id: t.id,
            name: t.name,
            distance: t.distance,
            duration: t.duration,
            difficulty: t.difficulty,
            coverUrl: t.coverUrl,
          })),
        },
      };
    } catch (error) {
      console.error('Error in GetDashHomeUseCase:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch dashboard home data',
          statusCode: 500,
        },
      };
    }
  }
}

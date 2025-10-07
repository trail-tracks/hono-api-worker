import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../drizzle/db";
import { entity } from "../../drizzle/schema";

export interface ListTrailsUseCaseResponse {
  success: boolean;
  trails?: any[];
  error?: string;
}

export class ListTrailsUseCase {
  static async execute(
    d1Database: D1Database,
    id: number
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
          error: "Entidade não encontrada ou foi excluída",
        };
      }

      const trailsList = [{}, {}];
      // const trailsList = await db.select().from(trails).where(eq(entityId, id));

      return {
        success: true,
        trails: trailsList,
      };
    } catch (error) {
      console.error("Erro ao editar entidade:", error);
      return {
        success: false,
        error: "Erro interno do servidor",
      };
    }
  }
}

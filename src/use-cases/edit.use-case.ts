import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../drizzle/db";
import { entity } from "../../drizzle/schema";
import { EditDTO } from "../dtos/edit.dto";

export interface EditEntityUseCaseResponse {
  success: boolean;
  entity?: {
    id: number;
    name: string;
    nameComplement: string | null;
    zipCode: string;
    address: string;
    number: string;
    city: string;
    state: string;
    addressComplement: string | null;
    phone: string;
  };
  error?: string;
}

export class EditEntityUseCase {
  static async execute(
    d1Database: D1Database,
    entityData: EditDTO,
    entityId: number
  ): Promise<EditEntityUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      // Verificar se a entidade existe e não foi deletada
      const existingEntity = await db
        .select()
        .from(entity)
        .where(and(eq(entity.id, entityId), isNull(entity.deletedAt)))
        .get();

      if (existingEntity === undefined) {
        return {
          success: false,
          error: "Entidade não encontrada ou foi excluída",
        };
      }

      // Atualizar entidade
      const [updatedEntity] = await db
        .update(entity)
        .set({
          name: entityData.name,
          nameComplement: entityData.nameComplement,
          zipCode: entityData.zipCode,
          address: entityData.address,
          number: entityData.number.toString(),
          city: entityData.city,
          state: entityData.state,
          addressComplement: entityData.addressComplement,
          phone: entityData.phone,
        })
        .where(eq(entity.id, entityId))
        .returning({
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
        });

      return {
        success: true,
        entity: updatedEntity,
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

import { eq } from 'drizzle-orm';
import { EditDTO } from '../dtos/edit.dto';
import { getDb } from '../../drizzle/db';
import { entity } from '../../drizzle/schema';

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
  ): Promise<EditEntityUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      // Verificar se a entidade existe
      const existingEntity = await db
        .select()
        .from(entity)
        .where(eq(entity.id, entityData.id))
        .get();

      if (existingEntity === undefined) {
        return {
          success: false,
          error: 'Entidade Invalida',
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
        .where(eq(entity.id, entityData.id))
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
      console.error('Erro ao editar entidade:', error);
      return {
        success: false,
        error: 'Erro interno do servidor',
      };
    }
  }
}

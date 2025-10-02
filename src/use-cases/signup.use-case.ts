import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { getDb } from '../../drizzle/db';
import { CreateEntityDtoType } from '../dtos/signup.dto';
import { attachment, entity } from '../../drizzle/schema';

export interface CreateEntityUseCaseResponse {
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
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

export class CreateEntityUseCase {
  static async execute(
    d1Database: D1Database,
    entityData: CreateEntityDtoType,
  ): Promise<CreateEntityUseCaseResponse> {
    const db = getDb(d1Database);

    try {
      // Verificar se email já existe
      const existingEntity = await db
        .select()
        .from(entity)
        .where(eq(entity.email, entityData.email))
        .get();

      if (existingEntity) {
        return {
          success: false,
          error: {
            message: 'Email já cadastrado',
            statusCode: 409, // Conflict
          },
        };
      }

      // Verificar se telefone já existe (opcional)
      const existingPhone = await db
        .select()
        .from(entity)
        .where(eq(entity.phone, entityData.phone))
        .get();

      if (existingPhone) {
        return {
          success: false,
          error: {
            message: 'Telefone já cadastrado',
            statusCode: 409,
          },
        };
      }

      let existingAttachment: {
        uuid: string;
        entityId: number | null;
      } | null = null;

      if (entityData.attachmentUuid) {
        const fetchedAttachment = await db
          .select({
            uuid: attachment.uuid,
            entityId: attachment.entityId,
          })
          .from(attachment)
          .where(eq(attachment.uuid, entityData.attachmentUuid))
          .get();

        if (!fetchedAttachment) {
          return {
            success: false,
            error: {
              message: 'Anexo não encontrado para o UUID informado',
              statusCode: 404,
            },
          };
        }

        if (fetchedAttachment.entityId) {
          return {
            success: false,
            error: {
              message: 'Este anexo já foi associado a outro cadastro',
              statusCode: 409,
            },
          };
        }

        existingAttachment = fetchedAttachment;
      }

      // Hash da senha
      const hashedPassword = await hash(entityData.password, 12);

      // Inserir no banco
      const result = await db
        .insert(entity)
        .values({
          name: entityData.name,
          nameComplement: entityData.nameComplement || null,
          email: entityData.email,
          password: hashedPassword,
          zipCode: entityData.zipCode,
          address: entityData.address,
          number: entityData.number,
          city: entityData.city,
          state: entityData.state,
          addressComplement: entityData.addressComplement || null,
          phone: entityData.phone,
        })
        .returning()
        .get();

      if (entityData.attachmentUuid && existingAttachment) {
        const now = new Date();
        await db
          .update(attachment)
          .set({
            entityId: result.id,
            updatedAt: now,
          })
          .where(eq(attachment.uuid, existingAttachment.uuid))
          .run();
      }

      // Retornar dados sem a senha
      return {
        success: true,
        entity: {
          id: result.id,
          name: result.name,
          email: result.email,
          zipCode: result.zipCode,
          address: result.address,
          number: result.number,
          city: result.city,
          state: result.state,
          phone: result.phone,
          nameComplement: result.nameComplement,
          addressComplement: result.addressComplement,
        },
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no CreateEntityUseCase:', error);

      return {
        success: false,
        error: {
          message: 'Erro interno do servidor ao criar entity',
          statusCode: 500,
        },
      };
    }
  }
}

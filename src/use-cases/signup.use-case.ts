import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import { getDb } from '../../drizzle/db';
import { CreateEntityDtoType } from '../dtos/signup.dto';
import { entity } from '../../drizzle/schema';

export interface CreateEntityUseCaseResponse {
  success: boolean;
  token?: string;
  error?: {
    message: string;
    statusCode: number;
  };
}

export class CreateEntityUseCase {
  static async execute(
    d1Database: D1Database,
    entityData: CreateEntityDtoType,
    jwtSecret: string,
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

      const payload = {
        sub: result.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
      };

      const token = await sign(payload, jwtSecret);

      // Retornar dados sem a senha
      return {
        success: true,
        token,
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

import { eq } from 'drizzle-orm';
import { RegisterDTO } from '../dtos/register.dto';
import { getDb } from '../../drizzle/db';
import { users } from '../../drizzle/schema';

export interface RegisterUserUseCaseResponse {
  success: boolean
  user?: {
    id: number
    name: string
    email: string
  }
  error?: string
}

export class RegisterUserUseCase {
  static async execute(
    d1Database: D1Database,
    userData: RegisterDTO,
  ): Promise<RegisterUserUseCaseResponse> {
    const db = getDb(d1Database);
    try {
      // Verificar se o email já existe
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, userData.email))
        .get();

      if (existingUser) {
        return {
          success: false,
          error: 'Email já está em uso',
        };
      }

      // Hash da senha (você pode usar bcrypt ou outra lib)
      // const hashedPassword = await hash(userData.password)

      // Inserir o usuário
      const [newUser] = await db
        .insert(users)
        .values({
          name: userData.name,
          email: userData.email,
          password: userData.password, // Em produção, use hashedPassword
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
        });

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return {
        success: false,
        error: 'Erro interno do servidor',
      };
    }
  }
}

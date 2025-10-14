import { and, eq, isNull } from "drizzle-orm";
import { entity, trail } from "../../drizzle/schema";
import { getDb } from "../../drizzle/db";

export interface CreateTrailsUseCaseRequest {
    success: boolean;
    trial?: {
    name: string;
    description?: string;
    shortDescription?: string;
    duration?: number;
    distance?: number;
    difficulty?: string;
    entityId: number;
    }
    error?: {
        message: string;
        statusCode: number;
    };

}

export class CreateTrailsUseCase {
    static async execute(
        d1Database: D1Database,
        id: number,
    ): Promise<CreateTrailsUseCaseRequest> {
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
                    error: {
                        message: "Entidade não encontrada ou foi excluída",
                        statusCode: 404,
                    },
                };
            }
            // Criar a trilha   

            const newTrail = await db
                .insert(trail)
                .values({
                    name: "Nome da Trilha",
                    description: "Descrição da Trilha",
                    shortDescription: "Descrição Curta",
                    duration: 120,
                    distance: 10,
                    difficulty: "Médio",
                    entityId: id,
                })
                .returning({
                    name: trail.name,
                    description: trail.description,
                    shortDescription: trail.shortDescription,
                    duration: trail.duration,
                    distance: trail.distance,
                    difficulty: trail.difficulty,
                    entityId: trail.entityId,
                })
                .get();

            return {
                success: true,
              
            };
        }
        
        catch (error) {   
        return {
            success: false,
            error: {
                message: "Erro ao criar a trilha",
                statusCode: 500,
            },
        };
    }

    }   
}
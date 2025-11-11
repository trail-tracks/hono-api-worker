import { eq } from "drizzle-orm";
import { pointOfInterest, trail } from "../../drizzle/schema";
import { CreatePointDto } from "../dtos/create-point.dto";
import { getDb } from "../../drizzle/db";

export interface CreatePointUseCaseResponse {
    success: boolean;
    point?: {
        id: number;
        name: string;
        shortDescription: string | null;
        description: string | null;
        trailId: number | null;
    };
    error?: {
        message: string;
        statusCode: number;
    };
    }

export class CreatePointUseCase {
    async execute(
        D1Database: D1Database,
        pointData: CreatePointDto,
        trailId: number
    ): Promise<CreatePointUseCaseResponse> {
        const db = getDb(D1Database);
        try {
            // Verificar se a trilha existe
            const existingTrail = await db
                .select()
                .from(trail)
                .where(eq(trail.id, trailId))
                .get();

            if (!existingTrail) {
                return {
                    success: false,
                    error: {
                        message: "Trilha não encontrada",
                        statusCode: 404,
                    },
                };
            }

            // Criar o ponto de interesse
            const newPoint = await db
                .insert(pointOfInterest)
                .values({
                    name: pointData.name,
                    shortDescription: pointData.shortDescription,
                    description: pointData.description,
                    trailId: trailId,
                })
                .returning()
                .get();

            return {
                success: true,
                point: {
                    id: newPoint.id,
                    name: newPoint.name,
                    shortDescription: newPoint.shortDescription,
                    description: newPoint.description,
                    trailId: newPoint.trailId,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Erro ao criar ponto de interesse",
                    statusCode: 500,
                },
            };
        }
    }
}
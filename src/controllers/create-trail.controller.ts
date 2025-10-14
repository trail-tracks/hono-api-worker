import { Context } from "hono";
import { AppBindings } from "../types/env";
import { CreateTrailsUseCase } from "../use-cases/create-trails.use-case";

export class CreateTrailControlle {

    async create(c: Context<{ Bindings: AppBindings }>) {
        
        try {
            const trailId = c.req.param("trail");
            const id = Number(trailId);
            const result = await CreateTrailsUseCase.execute(c.env.DB, id);
            if (result.error) {
                return c.json({ error: result.error.message }, result.error.statusCode);
            }
            return c.json({ trail: result.trail }, 201);
        } catch (error) {
            console.error("Erro ao criar a trilha:", error);
            return c.json({ error: "Erro interno do servidor" }, 500);
        }    

}
}
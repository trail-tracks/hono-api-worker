import { Context } from 'hono';
import { DeleteDTO } from '../dtos/delete.dto';
import { DeleteEntityUseCase } from '../use-cases/delete.use-case';

type Env = {
  Bindings: { DB: D1Database };
};

export class DeleteEntityController {
  async delete(c: Context<Env>) {
    try {
      const entityData: DeleteDTO = await c.req.json();

      const result = await DeleteEntityUseCase.execute(c.env.DB, entityData);

      if (!result.success) {
        return c.json(
          {
            error: result.error,
            message: 'Falha na exclusão da entidade',
          },
          400,
        );
      }

      return c.json(
        {
          message: 'Entidade excluída com sucesso',
          entity: result.entity,
        },
        200,
      );
    } catch {
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha na exclusão da entidade',
        },
        500,
      );
    }
  }
}

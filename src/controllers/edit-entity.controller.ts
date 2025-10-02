import { Context } from 'hono';
import { EditDTO } from '../dtos/edit.dto';
import { EditEntityUseCase } from '../use-cases/edit.use-case';
import { AppBindings } from '../types/env';

export class EditEntityController {
  async edit(c: Context<{ Bindings: AppBindings }>) {
    try {
      const entityData: EditDTO = await c.req.json();

      const result = await EditEntityUseCase.execute(c.env.DB, entityData);

      if (!result.success) {
        return c.json(
          {
            error: result.error,
            message: 'Falha na edição da entidade',
          },
          400,
        );
      }

      return c.json(
        {
          message: 'Entidade editada com sucesso',
          entity: result.entity,
        },
        200,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro no controller de edição:', error);
      return c.json(
        {
          error: 'Erro interno do servidor',
          message: 'Falha na edição da entidade',
        },
        500,
      );
    }
  }
}

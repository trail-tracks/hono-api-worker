import { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppBindings } from '../types/env';
import { DeleteAttachmentUseCase } from '../use-cases/delete-attachment.use-case';

export class DeleteAttachmentsController {
  async delete(c: Context<{ Bindings: AppBindings }>) {
    try {
      const entityId = Number(c.get('jwtPayload').userId);
      const attachmentId = Number(c.req.param('id'));
      

      const result = await DeleteAttachmentUseCase.execute({
        d1Database: c.env.DB,
        bucket: c.env.R2_BUCKET,
        accountId: c.env.R2_ACCOUNT_ID,
        accessKeyId: c.env.R2_ACCESS_KEY_ID,
        secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
        attachmentId,
        entityId,
      });

      if (result.success !== true) {
        const status = (result.error?.statusCode
          ?? 500) as ContentfulStatusCode;
        return c.json(
          { error: result.error?.message ?? 'Falha ao deletar a imagem.' },
          status,
        );
      }

      return c.json(
        {
          message: 'Imagem deletada com sucesso',
        },
        201,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao deletar o anexo:', error);

      return c.json(
        { error: 'Erro interno do servidor ao processar a solicitação.' },
        500,
      );
    }
  }
}

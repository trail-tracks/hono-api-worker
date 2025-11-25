import { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { UploadAttachmentUseCase } from '../use-cases/upload-attachment.use-case';
import { AppBindings } from '../types/env';
import { uploadAttachmentSchema } from '../dtos/upload-attachment.dto';

export class AttachmentsController {
  async upload(c: Context<{ Bindings: AppBindings }>) {
    try {
      const contentType = c.req.header('content-type');
      const rawParams = c.req.query();
      const param = uploadAttachmentSchema.parse(rawParams);

      if (!contentType || !contentType.includes('multipart/form-data')) {
        return c.json(
          { error: 'Content-Type inválido. Use multipart/form-data.' },
          400,
        );
      }

      const body = await c.req.parseBody();
      const payload = body.file ?? body.attachment ?? body.image;
      const fileCandidate = Array.isArray(payload) ? payload[0] : payload;

      if (!(fileCandidate instanceof File)) {
        return c.json(
          { error: 'Arquivo não encontrado no payload. Use o campo "file".' },
          400,
        );
      }

      if (!fileCandidate.type?.startsWith('image/')) {
        return c.json(
          { error: 'Somente arquivos de imagem são permitidos.' },
          400,
        );
      }

      const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
      if (fileCandidate.size > MAX_SIZE_BYTES) {
        return c.json({ error: 'Arquivo muito grande. Limite de 5MB.' }, 413);
      }

      // Lógica de priorização:
      // 1. Se trailId foi enviado, usa apenas trailId
      // 2. Se pointOfInterestId foi enviado, usa apenas pointOfInterestId
      // 3. Se entityId foi enviado, usa apenas entityId
      // 4. Se nenhum foi enviado, usa o userId do JWT como entityId
      let entityId: number | undefined;
      let trailId: number | undefined;
      let pointOfInterestId: number | undefined;

      if (param.trailId) {
        trailId = Number(param.trailId);
      } else if (param.pointOfInterestId) {
        pointOfInterestId = Number(param.pointOfInterestId);
      } else if (param.entityId) {
        entityId = Number(param.entityId);
      } else {
        // Se nenhum parâmetro foi enviado, usa o userId do JWT
        entityId = Number(c.get('jwtPayload').userId);
      }

      const result = await UploadAttachmentUseCase.execute({
        d1Database: c.env.DB,
        file: fileCandidate,
        bucket: c.env.R2_BUCKET,
        accountId: c.env.R2_ACCOUNT_ID,
        accessKeyId: c.env.R2_ACCESS_KEY_ID,
        secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
        type: param.type,
        entityId,
        trailId,
        pointOfInterestId,
      });

      if (result.success !== true) {
        const status = (result.error?.statusCode
          ?? 500) as ContentfulStatusCode;
        return c.json(
          { error: result.error?.message ?? 'Falha ao processar o upload.' },
          status,
        );
      }

      return c.json(
        {
          message: 'Upload realizado com sucesso',
        },
        201,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao processar upload de anexo:', error);

      return c.json(
        { error: 'Erro interno do servidor ao processar upload.' },
        500,
      );
    }
  }
}

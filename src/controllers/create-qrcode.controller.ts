import { Context } from 'hono';
import { CreateQRCodeUseCase } from '../use-cases/create-qrcode.use-case';
import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppBindings, AppVariables } from '../types/env';

export class CreateQRCodeController {
  async execute(c: Context<{ Bindings: AppBindings; Variables: AppVariables }>) {
    const { trailId } = c.req.param();
    const entityId = Number(c.get('jwtPayload').userId);

    if (!entityId) {
      return c.json(
        {
          success: false,
          error: {
            message: 'Entidade não autenticada',
            statusCode: 401,
          },
        },
        401,
      );
    }

    const result = await CreateQRCodeUseCase.execute({
      d1Database: c.env.DB,
      trailId: Number(trailId),
      entityId,
    });

    if (!result.success) {
      const status = (result.error?.statusCode ??
        500) as ContentfulStatusCode;
      return c.json(
        {
          error: result.error?.message,
        },
        status
      );
    }

    if (!result.pdf) {
      return c.json(
        {
          error: 'PDF não foi gerado',
        },
        500
      );
    }

    // Retornar PDF como resposta
    return c.body(result.pdf, 200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="qrcodes-trilha-${trailId}.pdf"`,
    });
  }
}

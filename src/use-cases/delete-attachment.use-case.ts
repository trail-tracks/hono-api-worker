import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, pointOfInterest, trail } from '../../drizzle/schema';

export interface DeleteAttachmentUseCaseInput {
  d1Database: D1Database;
  attachmentId: number;
  entityId: number;
  bucket: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface DeleteAttachmentUseCaseResponse {
  success: boolean;
  error?: {
    message: string;
    statusCode: number;
  };
}

export class DeleteAttachmentUseCase {
  private static createClient(params: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
  }) {
    const { accountId, accessKeyId, secretAccessKey } = params;

    return new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  static async execute(
    params: DeleteAttachmentUseCaseInput,
  ): Promise<DeleteAttachmentUseCaseResponse> {
    const {
      d1Database,
      attachmentId,
      entityId,
      bucket,
      accountId,
      accessKeyId,
      secretAccessKey,
    } = params;

    const db = getDb(d1Database);

    try {
      // Buscar o attachment e verificar se pertence à entidade
      const attachmentData = await db
        .select({
          id: attachment.id,
          uuid: attachment.uuid,
          bucket: attachment.bucket,
          objectKey: attachment.objectKey,
          entityId: attachment.entityId,
          trailId: attachment.trailId,
          pointOfInterestId: attachment.pointOfInterestId,
        })
        .from(attachment)
        .where(eq(attachment.id, attachmentId))
        .get();

      if (!attachmentData) {
        return {
          success: false,
          error: {
            message: 'Anexo não encontrado',
            statusCode: 404,
          },
        };
      }

      // Verificar se o attachment pertence à entidade
      let belongsToEntity = false;

      if (attachmentData.entityId === entityId) {
        belongsToEntity = true;
      } else if (attachmentData.trailId) {
        // Verificar se a trail pertence à entidade
        const trailData = await db
          .select({ entityId: trail.entityId })
          .from(trail)
          .where(eq(trail.id, attachmentData.trailId))
          .get();

        if (trailData?.entityId === entityId) {
          belongsToEntity = true;
        }
      } else if (attachmentData.pointOfInterestId) {
        // Verificar se o point of interest pertence à entidade através da trail
        const pointData = await db
          .select({ entityId: trail.entityId })
          .from(pointOfInterest)
          .innerJoin(trail, eq(pointOfInterest.trailId, trail.id))
          .where(eq(pointOfInterest.id, attachmentData.pointOfInterestId))
          .get();

        if (pointData?.entityId === entityId) {
          belongsToEntity = true;
        }
      }

      if (!belongsToEntity) {
        return {
          success: false,
          error: {
            message: 'Você não tem permissão para deletar este anexo',
            statusCode: 403,
          },
        };
      }

      // Deletar do R2
      const client = this.createClient({
        accountId,
        accessKeyId,
        secretAccessKey,
      });

      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: attachmentData.objectKey,
        }),
      );

      // Deletar do banco de dados
      await db
        .delete(attachment)
        .where(eq(attachment.id, attachmentId))
        .execute();

      return {
        success: true,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('DeleteAttachmentUseCase error:', error);

      return {
        success: false,
        error: {
          message: 'Não foi possível deletar o anexo',
          statusCode: 500,
        },
      };
    }
  }
}


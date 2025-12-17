import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';
import { getDb } from '../../drizzle/db';
import { attachment, pointOfInterest, trail } from '../../drizzle/schema';

export interface DeletePointOfInterestUseCaseInput {
  d1Database: D1Database;
  pointOfInterestId: number;
  entityId: number;
  bucket: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface DeletePointOfInterestUseCaseResponse {
  success: boolean;
  error?: {
    message: string;
    statusCode: number;
  };
}

export class DeletePointOfInterestUseCase {
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
    params: DeletePointOfInterestUseCaseInput,
  ): Promise<DeletePointOfInterestUseCaseResponse> {
    const {
      d1Database,
      pointOfInterestId,
      entityId,
      bucket,
      accountId,
      accessKeyId,
      secretAccessKey,
    } = params;

    const db = getDb(d1Database);

    try {
      // Buscar o ponto de interesse e verificar se pertence à entidade
      const pointData = await db
        .select({
          id: pointOfInterest.id,
          trailId: pointOfInterest.trailId,
          entityId: trail.entityId,
        })
        .from(pointOfInterest)
        .innerJoin(trail, eq(pointOfInterest.trailId, trail.id))
        .where(eq(pointOfInterest.id, pointOfInterestId))
        .get();

      if (!pointData) {
        return {
          success: false,
          error: {
            message: 'Ponto de interesse não encontrado',
            statusCode: 404,
          },
        };
      }

      // Verificar se o ponto de interesse pertence à entidade
      if (pointData.entityId !== entityId) {
        return {
          success: false,
          error: {
            message: 'Você não tem permissão para deletar este ponto de interesse',
            statusCode: 403,
          },
        };
      }

      // Buscar todos os attachments do ponto de interesse
      const attachments = await db
        .select({
          id: attachment.id,
          objectKey: attachment.objectKey,
        })
        .from(attachment)
        .where(eq(attachment.pointOfInterestId, pointOfInterestId))
        .all();

      // Deletar attachments do R2
      if (attachments.length > 0) {
        const client = this.createClient({
          accountId,
          accessKeyId,
          secretAccessKey,
        });

        await Promise.allSettled(
          attachments.map((att) => client
            .send(
              new DeleteObjectCommand({
                Bucket: bucket,
                Key: att.objectKey,
              }),
            )
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(`Erro ao deletar arquivo do R2: ${att.objectKey}`, error);
            })),
        );

        // Deletar attachments do banco de dados
        await db
          .delete(attachment)
          .where(eq(attachment.pointOfInterestId, pointOfInterestId))
          .execute();
      }

      // Deletar o ponto de interesse do banco de dados
      await db
        .delete(pointOfInterest)
        .where(eq(pointOfInterest.id, pointOfInterestId))
        .execute();

      return {
        success: true,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('DeletePointOfInterestUseCase error:', error);

      return {
        success: false,
        error: {
          message: 'Não foi possível deletar o ponto de interesse',
          statusCode: 500,
        },
      };
    }
  }
}

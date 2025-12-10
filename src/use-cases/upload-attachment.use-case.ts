import '../polyfills/dom-parser';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { attachment } from '../../drizzle/schema';
import { getDb } from '../../drizzle/db';
import { and, eq } from 'drizzle-orm';

// Define as interfaces de entrada e saída do caso de uso
export interface UploadAttachmentUseCaseInput {
  d1Database: D1Database;
  file: File;
  bucket: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  type: 'gallery' | 'cover' | 'poster';
  entityId?: number;
  trailId?: number;
  pointOfInterestId?: number;
}

// Define a interface de resposta do caso de uso
export interface UploadAttachmentUseCaseResponse {
  success: boolean;
  attachment?: {
    uuid: string;
    bucket: string;
    objectKey: string;
    mimeType?: string | null;
    size?: number | null;
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

// Define um client do S3 para upload de arquivos para o R2
export class UploadAttachmentUseCase {
  private static db: DrizzleD1Database<Record<string, never>> & { $client: D1Database; };

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

  // Executa o caso de uso de upload de anexo
  static async execute(
    params: UploadAttachmentUseCaseInput,
  ): Promise<UploadAttachmentUseCaseResponse> {

    const {
      d1Database,
      file,
      bucket,
      accountId,
      accessKeyId,
      secretAccessKey,
    } = params;

    UploadAttachmentUseCase.db = getDb(d1Database);
    const contentType = file.type || 'application/octet-stream';
    const baseObjectKey: string = 'uploads';

    try {
      const arrayBuffer = await file.arrayBuffer();
      const body = new Uint8Array(arrayBuffer);

      const client = this.createClient({
        accountId,
        accessKeyId,
        secretAccessKey,
      });

      if (params.entityId) {
        const entityObjectKey = `${baseObjectKey}/entity`;
        await this.saveEntityPicture(
          client,
          bucket,
          body,
          contentType,
          params.type,
          params.entityId,
          entityObjectKey,
          file.size,
        );
      }

      if (params.trailId) {
        // Poster só é permitido para entidades
        if (params.type === 'poster') {
          return {
            success: false,
            error: {
              message: 'O tipo "poster" só é permitido para entidades',
              statusCode: 400,
            },
          };
        }

        const trailObjectKey = `${baseObjectKey}/trail`;
        await this.saveTrailPicture(
          client,
          bucket,
          body,
          contentType,
          params.type,
          params.trailId,
          trailObjectKey,
          file.size,
        );
      }

      if (params.pointOfInterestId) {
        // Poster só é permitido para entidades
        if (params.type === 'poster') {
          return {
            success: false,
            error: {
              message: 'O tipo "poster" só é permitido para entidades',
              statusCode: 400,
            },
          };
        }

        const pointObjectKey = `${baseObjectKey}/point-of-interest`;
        await this.savePointOfInterestPicture(
          client,
          bucket,
          body,
          contentType,
          params.type,
          params.pointOfInterestId,
          pointObjectKey,
          file.size,
        );
      }

      return {
        success: true,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('UploadAttachmentUseCase error:', error);

      return {
        success: false,
        error: {
          message: 'Não foi possível processar o upload do anexo',
          statusCode: 500,
        },
      };
    }
  }

  private static async saveEntityPicture(
    client: S3Client,
    bucket: string,
    body: Uint8Array<ArrayBuffer>,
    contentType: string,
    type: 'gallery' | 'cover' | 'poster',
    entityId: number,
    baseObjectKey: string,
    fileSize: number,
  ): Promise<void> {
    // Se for poster ou cover, deletar o anterior antes de criar o novo (são únicos)
    if (type === 'poster' || type === 'cover') {
      const existing = await this.db
        .select({
          id: attachment.id,
          objectKey: attachment.objectKey,
        })
        .from(attachment)
        .where(
          and(
            eq(attachment.entityId, entityId),
            eq(attachment.type, type)
          )
        )
        .get();

      if (existing) {
        // Deletar do R2
        try {
          await client.send(new DeleteObjectCommand({
            Bucket: bucket,
            Key: existing.objectKey,
          }));
        } catch (error) {
          console.error(`Erro ao deletar ${type} anterior do R2:`, error);
        }

        // Deletar do banco
        await this.db
          .delete(attachment)
          .where(eq(attachment.id, existing.id))
          .run();
      }
    }

    const uuid = crypto.randomUUID();

    const objectKey = type === 'cover' 
      ? `${baseObjectKey}/${entityId}/${type}/profile` 
      : type === 'poster'
      ? `${baseObjectKey}/${entityId}/${type}/poster`
      : `${baseObjectKey}/${entityId}/${type}/${uuid}`;

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
    }));

    const now = new Date();

    await this.db
      .insert(attachment)
      .values({
        uuid,
        bucket,
        objectKey,
        mimeType: contentType,
        size: fileSize,
        url: objectKey,
        type,
        entityId,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        uuid: attachment.uuid,
        bucket: attachment.bucket,
        objectKey: attachment.objectKey,
        url: attachment.url,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })
      .get();
  }

  private static async saveTrailPicture(
    client: S3Client,
    bucket: string,
    body: Uint8Array<ArrayBuffer>,
    contentType: string,
    type: 'gallery' | 'cover',
    trailId: number,
    baseObjectKey: string,
    fileSize: number,
  ): Promise<void> {
    const uuid = crypto.randomUUID();

    const objectKey = type === 'cover' ? `${baseObjectKey}/${trailId}/${type}/profile` : `${baseObjectKey}/${trailId}/${type}/${uuid}`;

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
    }));

    const now = new Date();

    await this.db
      .insert(attachment)
      .values({
        uuid,
        bucket,
        objectKey,
        mimeType: contentType,
        size: fileSize,
        url: objectKey,
        type,
        trailId,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        uuid: attachment.uuid,
        bucket: attachment.bucket,
        objectKey: attachment.objectKey,
        url: attachment.url,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })
      .get();
  }

  private static async savePointOfInterestPicture(
    client: S3Client,
    bucket: string,
    body: Uint8Array<ArrayBuffer>,
    contentType: string,
    type: 'gallery' | 'cover',
    pointOfInterestId: number,
    baseObjectKey: string,
    fileSize: number,
  ): Promise<void> {
    const uuid = crypto.randomUUID();

    const objectKey = type === 'cover' ? `${baseObjectKey}/${pointOfInterestId}/${type}/profile` : `${baseObjectKey}/${pointOfInterestId}/${type}/${uuid}`;

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
    }));

    const now = new Date();

    await this.db
      .insert(attachment)
      .values({
        uuid,
        bucket,
        objectKey,
        mimeType: contentType,
        size: fileSize,
        url: objectKey,
        type,
        pointOfInterestId,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        uuid: attachment.uuid,
        bucket: attachment.bucket,
        objectKey: attachment.objectKey,
        url: attachment.url,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })
      .get();
  }
}

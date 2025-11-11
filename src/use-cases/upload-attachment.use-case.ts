import '../polyfills/dom-parser';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { attachment } from '../../drizzle/schema';
import { getDb } from '../../drizzle/db';

// Define as interfaces de entrada e saída do caso de uso
export interface UploadAttachmentUseCaseInput {
  d1Database: D1Database;
  file: File;
  bucket: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  type: 'galery' | 'cover';
  entityId?: number;
  trailId?: number;
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
    type: 'galery' | 'cover',
    entityId: number,
    baseObjectKey: string,
    fileSize: number,
  ): Promise<void> {
    const uuid = crypto.randomUUID();

    const objectKey = `${baseObjectKey}/${entityId}/${type}/${uuid}`;

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
    type: 'galery' | 'cover',
    trailId: number,
    baseObjectKey: string,
    fileSize: number,
  ): Promise<void> {
    const uuid = crypto.randomUUID();

    const objectKey = `${baseObjectKey}/${trailId}/${type}/${uuid}`;

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
}

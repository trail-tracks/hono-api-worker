import '../polyfills/dom-parser';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { attachment } from '../../drizzle/schema';
import { getDb } from '../../drizzle/db';

export interface UploadAttachmentUseCaseInput {
  d1Database: D1Database;
  file: File;
  bucket: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl?: string;
}

export interface UploadAttachmentUseCaseResponse {
  success: boolean;
  attachment?: {
    uuid: string;
    bucket: string;
    objectKey: string;
    url?: string | null;
    mimeType?: string | null;
    size?: number | null;
  };
  error?: {
    message: string;
    statusCode: number;
  };
}

const buildPublicUrl = (
  accountId: string,
  bucket: string,
  objectKey: string,
  customBaseUrl?: string,
): string => {
  if (customBaseUrl) {
    const base = customBaseUrl.endsWith('/') ? customBaseUrl.slice(0, -1) : customBaseUrl;
    return `${base}/${objectKey}`;
  }

  return `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${objectKey}`;
};

export class UploadAttachmentUseCase {
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
    params: UploadAttachmentUseCaseInput,
  ): Promise<UploadAttachmentUseCaseResponse> {
    const {
      d1Database,
      file,
      bucket,
      accountId,
      accessKeyId,
      secretAccessKey,
      publicBaseUrl,
    } = params;

    const db = getDb(d1Database);
    const contentType = file.type || 'application/octet-stream';
    const objectKey = `uploads/${crypto.randomUUID()}`;
    const uuid = crypto.randomUUID();

    try {
      const arrayBuffer = await file.arrayBuffer();
      const body = new Uint8Array(arrayBuffer);

      const client = this.createClient({ accountId, accessKeyId, secretAccessKey });

      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
      }));

      const now = new Date();
      const url = buildPublicUrl(accountId, bucket, objectKey, publicBaseUrl);

      const inserted = await db
        .insert(attachment)
        .values({
          uuid,
          bucket,
          objectKey,
          mimeType: contentType,
          size: file.size,
          url,
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

      return {
        success: true,
        attachment: {
          uuid: inserted.uuid,
          bucket: inserted.bucket,
          objectKey: inserted.objectKey,
          url: inserted.url,
          mimeType: inserted.mimeType,
          size: inserted.size,
        },
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
}

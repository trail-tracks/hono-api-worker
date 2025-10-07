import z from 'zod';

export const uplaodAttachmentSchema = z.object({
  type: z.enum(['cover', 'galery']),
  entityId: z.string().optional(),
});

export type UploadAttachmentDto = z.infer<typeof uplaodAttachmentSchema>;

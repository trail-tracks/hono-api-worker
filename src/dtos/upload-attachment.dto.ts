import z from 'zod';

export const uploadAttachmentSchema = z.object({
  type: z.enum(['cover', 'galery']),
  entityId: z.string().optional(),
  trailId: z.string().optional(),
});

export type UploadAttachmentDto = z.infer<typeof uploadAttachmentSchema>;

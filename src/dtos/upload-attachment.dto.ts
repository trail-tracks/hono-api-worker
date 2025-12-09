import z from 'zod';

export const uploadAttachmentSchema = z.object({
  type: z.enum(['cover', 'gallery', 'poster']),
  entityId: z.string().optional(),
  trailId: z.string().optional(),
  pointOfInterestId: z.string().optional(),
});

export type UploadAttachmentDto = z.infer<typeof uploadAttachmentSchema>;

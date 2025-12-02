import z from 'zod';

export const createQRCodeSchema = z.object({
  trailId: z.string(),
});

export type CreateQRCodeDto = z.infer<typeof createQRCodeSchema>;

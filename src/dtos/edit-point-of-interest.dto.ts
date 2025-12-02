import { z } from 'zod';

export const editPointOfInterestSchema = z.object({
  name: z.string()
    .min(3, 'Nome do ponto de interesse deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do ponto de interesse muito longo')
    .optional(),

  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição muito longa')
    .nullable()
    .optional()
    .transform((val) => (val === undefined ? undefined : val || null)),

  shortDescription: z.string()
    .min(10, 'Breve descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Breve descrição muito longa')
    .optional(),
});

export type EditPointOfInterestDto = z.infer<typeof editPointOfInterestSchema>;

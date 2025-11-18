import { z } from 'zod';

export const createPointOfInterestSchema = z.object({
  name: z.string()
    .min(3, 'Nome do ponto de interesse deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do ponto de interesse muito longo'),

  shortDescription: z.string()
    .min(10, 'Breve descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Breve descrição muito longa'),

  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição muito longa')
    .optional()
    .nullable()
    .transform((val) => val || null),

  trailId: z.number()
    .int('ID da trilha deve ser um número inteiro')
    .positive('ID da trilha deve ser positivo'),
});

export type CreatePointOfInterestDto = z.infer<typeof createPointOfInterestSchema>;

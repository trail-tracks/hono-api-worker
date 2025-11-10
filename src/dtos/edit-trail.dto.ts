import { z } from 'zod';

export const editTrailSchema = z.object({
  id: z.number()
    .min(1, 'ID deve ser um número positivo'),

  name: z.string()
    .min(3, 'Nome da trilha deve ter pelo menos 3 caracteres')
    .max(100, 'Nome da trilha muito longo')
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

  duration: z.number()
    .int('Tempo estimado deve ser um número inteiro')
    .positive('Tempo estimado deve ser positivo')
    .min(1, 'Tempo estimado deve ser no mínimo 1 minuto')
    .max(10080, 'Tempo estimado não pode exceder 1 semana (10080 minutos)')
    .optional(),

  distance: z.number()
    .positive('Distância deve ser positiva')
    .min(0.1, 'Distância deve ser no mínimo 0.1 km')
    .max(1000, 'Distância não pode exceder 1000 km')
    .optional(),

  difficulty: z
    .enum(['facil', 'moderado', 'dificil', 'muito_dificil'] as const)
    .optional(),

  safetyTips: z.string()
    .min(10, 'Dicas de segurança devem ter pelo menos 10 caracteres')
    .max(2000, 'Dicas de segurança muito longas')
    .nullable()
    .optional()
    .transform((val) => (val === undefined ? undefined : val || null)),
});

export type EditTrailDto = z.infer<typeof editTrailSchema>;

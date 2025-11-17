import { z } from 'zod';

export const CreatePointDto = z.object({
    name: z.string()
        .min(3, 'Nome do ponto de interesse deve ter pelo menos 3 caracteres')
        .max(100, 'Nome do ponto de interesse muito longo'),
    
    shortDescription: z.string()
        .min(10, 'Breve descrição deve ter pelo menos 10 caracteres')
        .max(500, 'Breve descrição muito longa')
        .optional()
        .nullable()
        .transform((val) => val || null),
    
    description: z.string()
        .min(10, 'Descrição deve ter pelo menos 10 caracteres')
        .max(2000, 'Descrição muito longa')
        .optional()
        .nullable()
        .transform((val) => val || null),
    });

    export type CreatePointDto = z.infer<typeof CreatePointDto>;
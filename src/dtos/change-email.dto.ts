import z from 'zod';

export const changeEmailSchema = z.object({
  newEmail: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type ChangeEmailDTO = z.infer<typeof changeEmailSchema>;

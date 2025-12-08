import z from 'zod';

export const changePasswordSchema = z.object({
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;

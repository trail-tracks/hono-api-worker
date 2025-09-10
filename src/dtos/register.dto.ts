import z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(6).max(100),
});

export type RegisterDTO = z.infer<typeof registerSchema>;

import z from "zod";

export const editSchema = z.object({
  id: z.number(),
  name: z.string().min(3).max(50),
  nameComplement: z.string().min(3).max(100).nullable(),
  zipCode: z.string().length(8),
  address: z.string().min(3).max(256),
  number: z.number(),
  city: z.string().min(3).max(100),
  state: z.string().length(2),
  addressComplement: z.string().max(100).nullable(),
  phone: z.string().length(14),
});

export type EditDTO = z.infer<typeof editSchema>;

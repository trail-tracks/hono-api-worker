import { z } from 'zod';
import { institutions } from '../../drizzle/schema';
import { getDb } from '../../drizzle/db';

const db = getDb(env.DB);

export const InstitutionSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Nome muito curto" }),

    email: z
        .string()
        .email("Email inválido"),

    phone: z
        .string()
        .regex(/^\d+$/, { message: "O telefone deve conter apenas dígitos" })
        .min(12, { message: "O telefone deve conter 12 dígitos, incluindo o DDD ex: 012987654321" })
        .max(12, { message: "O telefone deve conter 12 dígitos, incluindo o DDD ex: 012987654321" }),


    password: z
        .string()
        .min(8, { message: "Minimo 8 caracteres" })
        .regex(/[A-Z]/, { message: "Deve conter ao menos uma letra maiúscula" })
        .regex(/[a-z]/, { message: "Deve conter ao menos uma letra minúscula" })
        .regex(/[0-9]/, { message: "Deve conter ao menos um número" })
        .regex(/[^A-Za-z0-9]/, { message: "Deve conter ao menos um caractere especial" }),
});

export type InstitutionType = z.infer<typeof InstitutionSchema>;

// Função para validar os dados de criação de instituição
export const InstitutionCreate = async (data: InstitutionType) => {
    const parsedData = InstitutionSchema.parse(data);
   ();
}

import { createInsertSchema} from "drizzle-zod";
import { z } from "zod";
import { institutions } from "../../drizzle/schema";

// schema para validação de criação de instituição
export const InstitutionInsertSchema = createInsertSchema(institutions, {
    name: z.string()
        .min(3, "O nome deve ter no mínimo 3 caracteres"),

    email: z.string(),

    password: z.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
        .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
        .regex(/\d/, "A senha deve conter pelo menos um número")
        .regex(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial"),
    
    phone: z.string()
        .min(12, "O telefone deve ter 12 dígitos ex: 088999999999")
        .max(12, "O telefone deve ter no máximo 12 dígitos ex: 088999999999")
        .regex(/^\d+$/, "O telefone deve conter apenas números"),
});


// tipo TypeScript para criação de instituição
export type InstitutionInsertType = typeof InstitutionInsertSchema;

// tipo TypeScript para retorno de instituição
export type InstitutionType = z.infer<typeof institutions>;

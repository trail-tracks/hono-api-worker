import { Context } from "hono";
import { institutions } from "../../drizzle/schema";
import { getDb } from "../../drizzle/db";
import { eq } from "drizzle-orm";
import { InstitutionInsertSchema } from "../model/institutions";
import bcrypt from "bcryptjs";

export const signup = async (c: Context) => {
    try {
        // valida os dados de entrada
        const institutionData = InstitutionInsertSchema.parse(await c.req.json());

        const db = getDb(c.env.DB);

        // verifica se o email já está em uso
        const existingInstitution = await db
        .select()
        .from(institutions)
        .where(eq(institutions.email, institutionData.email));

        if (existingInstitution.length > 0) {
            return c.json({ message: "Email já está em uso" }, 400);
        }

        // cria a nova instituição
        const hashedPassword = await bcrypt.hash(institutionData.password, 10);
        const newInstitution = await db
        .insert(institutions)
        .values({
            name: institutionData.name,
            email: institutionData.email,
            phone: institutionData.phone,
            password: hashedPassword,
        });

        return c.json(newInstitution, 201);

    } catch (error) {
        return c.json({ error: "Erro ao criar a instituição"}, 500);
    }
};


import { z } from 'zod';

// schema base para o CEP
const zipCodeSchema = z.string()
  .min(8, 'CEP deve ter 8 dígitos')
  .max(8, 'CEP deve ter 8 dígitos')
  .transform(cep => cep.replace(/\D/g, '')); // Remove não-dígitos

// schema para criação de entity
export const CreateEntityDto = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
    
  nameComplement: z.string()
    .optional()
    .nullable()
    .transform(val => val || null), // transforma undefined em null
    
  email: z.string()
    .max(255, 'Email muito longo'),
    
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
    
  zipCode: zipCodeSchema,
    
  address: z.string()
    .min(3, 'Endereço deve ter pelo menos 3 caracteres')
    .max(255, 'Endereço muito longo'),
    
  number: z.string()
    .min(1, 'Número é obrigatório')
    .max(10, 'Número muito longo'),
    
  city: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade muito longa'),
    
  state: z.string()
    .length(2, 'Estado deve ser a sigla (2 caracteres)')
    .toUpperCase(),
    
  addressComplement: z.string()
    .optional()
    .nullable()
    .transform(val => val || null),
    
  phone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone muito longo')
    .regex(/^\d+$/, 'Telefone deve conter apenas números')
    .transform(phone => phone.replace(/\D/g, ''))
});

// Schema para response (sem password)
export const EntityResponseDto = z.object({
  id: z.number(),
  name: z.string(),
  nameComplement: z.string().nullable(),
  email: z.string(),
  zipCode: z.string(),
  address: z.string(),
  number: z.string(),
  city: z.string(),
  state: z.string(),
  addressComplement: z.string().nullable(),
  phone: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Tipos TypeScript inferidos
export type CreateEntityDtoType = z.infer<typeof CreateEntityDto>;
export type EntityResponseDtoType = z.infer<typeof EntityResponseDto>;
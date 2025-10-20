# 🎓 AULA 03: Variáveis de Ambiente e Polyfills

## 🔐 PARTE 1: Variáveis de Ambiente

### O que são variáveis de ambiente?

São configurações secretas ou específicas do ambiente (desenvolvimento, produção, etc).

**Exemplos:**
- Senhas de banco de dados
- Chaves de API
- URLs diferentes para dev e produção

---

## 📁 Arquivos de Ambiente no Projeto

### 1. `.env.local.sample` (Template)

```env
JWT_SECRET="SUA-SECRET-DE-TESTE"

R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""
R2_PUBLIC_URL=""
```

**O que é?**
- Um arquivo de EXEMPLO
- Mostra quais variáveis você precisa configurar
- NÃO contém valores reais (por segurança)

**Como usar?**
1. Copie `.env.local.sample` para `.env.local`
2. Preencha com seus valores reais
3. O arquivo `.env.local` está no `.gitignore` (não vai pro GitHub)

---

### 2. `src/types/env.ts` (TypeScript Types)

```typescript
export type AppBindings = {
  DB: D1Database;
  JWT_SECRET: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  R2_PUBLIC_URL?: string;
};

export type AppVariables = {
  jwtPayload: {
    userId: string;
  };
};
```

**O que é?**
- Define os TIPOS das variáveis em TypeScript
- Não contém valores, apenas a estrutura
- Ajuda o editor a dar autocomplete e validar código

**Diferença:**
```
.env.local        → Valores reais (secrets)
env.ts            → Tipos TypeScript (estrutura)
```

---

## 🔄 Como as variáveis chegam no código?

### No Cloudflare Workers:

1. Você configura no dashboard da Cloudflare ou no `wrangler.jsonc`
2. O Cloudflare injeta as variáveis no objeto `env`
3. Você acessa via `c.env.NOME_DA_VARIAVEL`

### Exemplo:

```typescript
// No controller
async handle(c: Context<{ Bindings: AppBindings }>) {
  const jwtSecret = c.env.JWT_SECRET;  // ← Vem do Cloudflare
  const db = c.env.DB;                 // ← Vem do Cloudflare
  // ...
}
```

---

## 🔍 Onde configurar as variáveis?

### Opção 1: `wrangler.jsonc` (para desenvolvimento local)

```jsonc
{
  "name": "hono-api-worker",
  "d1_databases": [
    {
      "binding": "DB",  // ← Disponível como c.env.DB
      "database_name": "interactive-trail-db",
      "database_id": "2c9a28ef-a1f6-443d-adc9-508356bb2eb1"
    }
  ],
  "vars": {
    "JWT_SECRET": "minha-chave-secreta-local"  // ← c.env.JWT_SECRET
  }
}
```

### Opção 2: Dashboard Cloudflare (para produção)

1. Vai em Workers & Pages
2. Seleciona seu worker
3. Settings → Variables
4. Adiciona as variáveis

---

## 🧪 PARTE 2: Polyfills

### O que são Polyfills?

Polyfills são códigos que "simulam" funcionalidades que não existem no ambiente.

**Por que precisamos?**

O Cloudflare Workers não tem todas as APIs do navegador. Por exemplo:
- Não tem `DOMParser` (para ler XML)
- Não tem algumas APIs do Node.js

---

### Analisando `src/polyfills/dom-parser.ts`

```typescript
import { DOMParser as XmldomParser } from '@xmldom/xmldom';

type GlobalWithDomParser = typeof globalThis & {
  DOMParser?: typeof XmldomParser;
};

const globalWithDomParser = globalThis as GlobalWithDomParser;

if (typeof globalWithDomParser.DOMParser === 'undefined') {
  globalWithDomParser.DOMParser = XmldomParser;
}
```

**O que está acontecendo?**

1. **Linha 1**: Importa um DOMParser de uma biblioteca externa (`@xmldom/xmldom`)

2. **Linha 3-5**: Define um tipo TypeScript que diz "globalThis pode ter DOMParser"

3. **Linha 7**: Converte `globalThis` para o tipo definido

4. **Linha 9-11**: 
   - Verifica se `DOMParser` já existe
   - Se NÃO existir, adiciona o `XmldomParser`

**Por que isso é necessário?**

A biblioteca `@aws-sdk/client-s3` (usada para enviar arquivos pro R2) usa `DOMParser` internamente. Como o Cloudflare Workers não tem DOMParser nativo, precisamos "fingir" que tem!

---

## 🔗 Onde o polyfill é usado?

No arquivo `upload-attachment.use-case.ts`:

```typescript
import '../polyfills/dom-parser';  // ← Carrega o polyfill
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
```

Quando você importa o polyfill, ele executa e adiciona `DOMParser` ao ambiente global.

---

## 📊 Resumo Visual

```
Você executa: npm run dev
         ↓
Wrangler lê wrangler.jsonc
         ↓
Injeta variáveis no c.env
         ↓
Carrega polyfills
         ↓
Seu código roda com:
  - c.env.DB (banco D1)
  - c.env.JWT_SECRET
  - c.env.R2_BUCKET
  - DOMParser disponível globalmente
```

---

## ❓ Perguntas Frequentes

**Q: Por que não usar .env como no Node.js?**
A: Cloudflare Workers não é Node.js! As variáveis vêm do `wrangler.jsonc` ou do dashboard.

**Q: Como adicionar uma nova variável?**
A: 
1. Adicione em `AppBindings` no `env.ts`
2. Configure no `wrangler.jsonc` ou dashboard
3. Use no código via `c.env.NOME`

**Q: O polyfill afeta a performance?**
A: Muito pouco. Ele só adiciona uma funcionalidade faltante.

**Q: Posso remover o polyfill?**
A: Não! Sem ele, o upload de imagens vai quebrar.

---

## 🎯 Checklist de Configuração

Para rodar o projeto localmente:

- [ ] Crie `.env.local` baseado em `.env.local.sample`
- [ ] Configure `JWT_SECRET` (qualquer string longa)
- [ ] Configure credenciais R2 (do dashboard Cloudflare)
- [ ] Execute `npm run dev`
- [ ] As variáveis estarão em `c.env.*`

---

## 🔗 Próxima Aula

Na próxima aula vamos ver:
- Fluxo completo de uma rota (criar trilha)
- Como testar as rotas
- Comandos CLI

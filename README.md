# Hono API Worker

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.0.0 ou superior)
- **npm** (vem com o Node.js)
- **Git** para controle de versão
- Uma conta no **Cloudflare** (gratuita)

## 🍴 Como fazer Fork e configurar o projeto

### 1. Fork do repositório

1. Acesse o [repositório original](https://github.com/trail-tracks/hono-api-worker)
2. Clique no botão **"Fork"** no canto superior direito
3. Escolha sua conta/organização como destino

### 2. Clone seu fork

```bash
# Clone o seu fork (substitua 'seu-usuario' pelo seu username)
git clone https://github.com/seu-usuario/hono-api-worker.git

# Entre no diretório
cd hono-api-worker

# Adicione o repositório original como upstream (opcional)
git remote add upstream https://github.com/trail-tracks/hono-api-worker.git
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure o Wrangler (CLI do Cloudflare)

```bash
# Instale o Wrangler globalmente
npm install -g wrangler

# Faça login na sua conta Cloudflare
wrangler auth login
```

### 5. Configure o banco de dados D1

```bash
# Crie um banco D1 (se ainda não existe)
npx wrangler d1 create hono-api-worker-fork

# Gere a migration inicial do schema (initial_schema é o nome da migration)
npm run db:generate initial_schema

# Aplique as migrations no banco local
npm run db:migrate:local

```

## 🛠️ Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento local |
| `npm run deploy` | Faz deploy da aplicação para o Cloudflare Workers |
| `npm run test` | Executa os testes em modo watch |
| `npm run test:run` | Executa os testes uma única vez |
| `npm run cf-typegen` | Gera tipos TypeScript baseados na configuração do Workers |
| `npm run db:generate <nome>` | Gera uma nova migration com nome personalizado |
| `npm run db:migrate:local` | Aplica migrations no banco D1 local |
| `npm run db:migrate:prod` | Aplica migrations no banco D1 de produção |

## 🧑‍💻 Desenvolvimento

### Desenvolvimento local

```bash
# Inicia o servidor local na porta 8787
npm run dev
```

Acesse `http://localhost:8787` para ver sua aplicação rodando localmente.

### Estrutura do projeto

```
├── src/
│   ├── index.ts          # Ponto de entrada da aplicação
│   └── index.spec.ts     # Testes da aplicação
├── wrangler.jsonc        # Configuração do Cloudflare Workers
├── vitest.config.ts      # Configuração do Vitest
├── tsconfig.json         # Configuração do TypeScript
└── package.json          # Dependências e scripts
```

### Exemplo básico de uso

```typescript
// src/index.ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default app;
```

### ⚙️ Configuração do VS Code

Para uma melhor experiência de desenvolvimento, recomendamos configurar o VS Code com as extensões e configurações apropriadas:

#### Extensões recomendadas

1. **ESLint** - Para linting e formatação de código 
   - Instale via VS Code Marketplace: [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - Ou use o comando: `ext install dbaeumer.vscode-eslint`

#### Configurar on Save

Adicione no seu `settings.json` do VS Code:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
  },
  "eslint.validate": ["typescript"],
}
```

## 🧪 Testes

Este projeto usa **Vitest** com suporte ao ambiente Cloudflare Workers:

```bash
# Executar testes em modo watch
npm run test

# Executar testes uma vez
npm run test:run
```

### Exemplo de teste

```typescript
// src/index.spec.ts
import { describe, it, expect } from 'vitest';
import { SELF } from 'cloudflare:test';

describe('API endpoints', () => {
  it('should return "Hello Hono!" on GET /', async () => {
    const response = await SELF.fetch('http://example.com/');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Hello Hono!');
  });
});
```

## 🚀 Deploy

### Deploy para produção

```bash
npm run deploy
```

Após o deploy, sua aplicação estará disponível em:
`https://seu-worker-name.seu-username.workers.dev`

## 📚 Recursos úteis

- [Documentação do Hono](https://hono.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Vitest](https://vitest.dev/)

## 🆘 Problemas comuns

### Erro de autenticação do Wrangler
```bash
wrangler auth login
```

### Erro de permissão ao instalar Wrangler globalmente
```bash
# Linux/macOS
sudo npm install -g wrangler

# Ou use npx para evitar instalação global
npx wrangler dev
```

### Testes não encontram módulo 'cloudflare:test'
Certifique-se de ter instalado as dependências corretas:
```bash
npm install -D @cloudflare/vitest-pool-workers @cloudflare/workers-types
```

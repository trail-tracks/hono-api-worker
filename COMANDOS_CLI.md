# 📟 GUIA DE COMANDOS CLI

## 🎯 Comandos Principais

### 🚀 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# O servidor vai rodar em: http://localhost:8787
# Pressione Ctrl+C para parar
```

**O que acontece:**
- Wrangler inicia um servidor local
- Simula o ambiente do Cloudflare Workers
- Recarrega automaticamente quando você edita o código
- Usa o banco D1 local (arquivo SQLite)

---

### 🗄️ Banco de Dados (D1)

```bash
# Gerar uma nova migration (quando você muda o schema)
npm run db:generate nome_da_migration

# Exemplo:
npm run db:generate add_safety_tips_to_trails
```

**O que acontece:**
- Drizzle compara o schema atual com o banco
- Gera arquivo SQL em `drizzle/migrations/`
- Esse arquivo contém os comandos SQL para atualizar o banco

```bash
# Aplicar migrations no banco LOCAL
npm run db:migrate:local
```

**O que acontece:**
- Executa os arquivos SQL em `drizzle/migrations/`
- Atualiza o banco SQLite local
- Use SEMPRE que gerar novas migrations

```bash
# Aplicar migrations no banco de PRODUÇÃO
npm run db:migrate:prod
```

**⚠️ CUIDADO:** Isso altera o banco de produção na Cloudflare!

```bash
# Abrir interface visual do banco (Drizzle Studio)
npm run db:studio
```

**O que acontece:**
- Abre uma interface web em `https://local.drizzle.studio`
- Você pode ver e editar dados manualmente
- Útil para debug e explorar o banco

---

### 🧪 Testes

```bash
# Rodar testes em modo watch (fica observando mudanças)
npm run test
```

**O que acontece:**
- Executa todos os arquivos `*.spec.ts`
- Fica rodando e re-executa quando você edita os testes

```bash
# Rodar testes uma única vez
npm run test:run
```

**O que acontece:**
- Executa todos os testes
- Mostra resultado e encerra

---

### 📦 Build e Deploy

```bash
# Compilar TypeScript para JavaScript
npm run build
```

**O que acontece:**
- TypeScript é compilado para JavaScript
- Arquivos são gerados em `dist/`
- Necessário antes do deploy

```bash
# Fazer deploy para produção (Cloudflare Workers)
npm run deploy
```

**O que acontece:**
- Compila o código
- Minifica (deixa menor)
- Envia para a Cloudflare
- Seu Worker fica online!

---

### 🔧 Utilitários

```bash
# Gerar tipos TypeScript baseados no wrangler.jsonc
npm run cf-typegen
```

**O que acontece:**
- Lê `wrangler.jsonc`
- Gera tipos TypeScript para as variáveis de ambiente
- Ajuda o editor a dar autocomplete

---

## 📝 Fluxo Típico de Desenvolvimento

### Primeira vez (Setup inicial)

```bash
# 1. Instalar dependências
npm install

# 2. Aplicar migrations
npm run db:migrate:local

# 3. Iniciar servidor
npm run dev
```

---

### Adicionando uma nova feature

```bash
# 1. Editar código (adicionar controller, use-case, etc)
# ... edite os arquivos ...

# 2. Se mudou o schema do banco:
npm run db:generate nome_da_mudanca
npm run db:migrate:local

# 3. Testar localmente
npm run dev
# ... teste com Postman/Insomnia ...

# 4. Rodar testes (se tiver)
npm run test:run

# 5. Fazer deploy
npm run deploy
```

---

### Mudando o Schema do Banco

```bash
# Exemplo: Adicionar campo "phone" na tabela "entity"

# 1. Editar drizzle/schema.ts
# Adicionar: phone: text("phone")

# 2. Gerar migration
npm run db:generate add_phone_to_entity

# 3. Aplicar migration localmente
npm run db:migrate:local

# 4. Testar
npm run dev

# 5. Aplicar em produção
npm run db:migrate:prod

# 6. Deploy
npm run deploy
```

---

## 🐛 Debugging

### Ver logs do servidor local

Quando você roda `npm run dev`, os logs aparecem no terminal:

```bash
[wrangler:inf] Ready on http://localhost:8787
[wrangler:inf] POST /auth/login 200 OK (143ms)
console.log → aparece aqui
console.error → aparece aqui
```

### Inspecionar banco local

```bash
# Abrir Drizzle Studio
npm run db:studio

# Ou acessar SQLite direto
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/HASH.sqlite
```

---

## ⚡ Comandos Rápidos (Aliases)

Você pode adicionar atalhos no `package.json`:

```json
"scripts": {
  "dev": "wrangler dev",
  "deploy": "wrangler deploy --minify",
  "db:gen": "npm run db:generate",
  "db:mig": "npm run db:migrate:local"
}
```

Aí você pode fazer:
```bash
npm run db:gen add_new_field
npm run db:mig
```

---

## 📊 Ordem de Execução Típica

### Dia a dia (desenvolvendo):
```
1. npm run dev              → Trabalhar no código
2. Editar arquivos
3. Testar no navegador/Postman
4. Repetir 2-3
5. Ctrl+C para parar
```

### Quando muda o banco:
```
1. Editar drizzle/schema.ts
2. npm run db:generate nome
3. npm run db:migrate:local
4. npm run dev
5. Testar
```

### Para produção:
```
1. npm run test:run         → Garantir que testes passam
2. npm run db:migrate:prod  → Atualizar banco de prod
3. npm run deploy           → Enviar código
```

---

## ❓ Quando Usar Cada Comando?

| Comando | Quando Usar |
|---------|-------------|
| `npm run dev` | **SEMPRE** que for trabalhar no projeto |
| `npm run db:generate` | Quando você **muda o schema** (drizzle/schema.ts) |
| `npm run db:migrate:local` | **Depois** de gerar migration |
| `npm run db:migrate:prod` | Quando for **atualizar produção** |
| `npm run db:studio` | Quando quiser **ver dados** visualmente |
| `npm run test` | Quando estiver **criando/editando testes** |
| `npm run test:run` | Antes de **fazer deploy** |
| `npm run build` | Automático com deploy, raramente manual |
| `npm run deploy` | Quando quiser **publicar em produção** |
| `npm run cf-typegen` | Quando **mudar wrangler.jsonc** |

---

## 🔥 Comandos Importantes para seu Caso

Para corrigir o erro que você teve e testar:

```bash
# 1. Garantir que o banco está atualizado
npm run db:migrate:local

# 2. Iniciar servidor
npm run dev

# 3. Em outro terminal, testar
curl -X POST http://localhost:8787/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456","zipCode":"12345678","address":"Rua Teste","number":"123","city":"São Paulo","state":"SP","phone":"11999999999"}'
```

---

## 🎉 Resumo dos Mais Usados

```bash
npm run dev              # Iniciar servidor (USE TODO DIA)
npm run db:generate X    # Gerar migration (quando muda schema)
npm run db:migrate:local # Aplicar migration (depois do generate)
npm run db:studio        # Ver banco visualmente
npm run test:run         # Rodar testes
npm run deploy           # Publicar em produção
```

---

## 💡 Dica Pro

Crie um arquivo `dev.sh` (Linux/Mac) ou `dev.bat` (Windows) com:

```bash
#!/bin/bash
npm run db:migrate:local
npm run dev
```

Aí você só precisa rodar:
```bash
./dev.sh
```

E ele já aplica migrations e inicia o servidor! 🚀

# 🎯 Instruções para aplicar as mudanças no banco de dados

## O que foi criado:

✅ DTO de validação: `src/dtos/create-trail.dto.ts`
✅ Use Case: `src/use-cases/create-trail.use-case.ts`
✅ Controller: `src/controllers/create-trail.controller.ts`
✅ Rota atualizada: `src/routes/trails.route.ts`
✅ Schema atualizado: `drizzle/schema.ts` (adicionado campo `safetyTips`)
✅ Exemplo de uso: `rotas.http`

## ⚠️ IMPORTANTE: Execute estes comandos para atualizar o banco de dados

### 1. Gerar a migration com o novo campo `safety_tips`
```bash
npm run db:generate add_safety_tips_to_trails
```

### 2. Aplicar a migration no banco local
```bash
npm run db:migrate:local
```

### 3. (Quando for para produção) Aplicar a migration no banco remoto
```bash
npm run db:migrate:prod
```

## 📝 Como testar a nova rota

### 1. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 2. Faça login para obter o token JWT (necessário para criar trilha)
Use a rota de login no arquivo `rotas.http` ou faça:
```bash
POST http://localhost:8787/auth/login
Content-Type: application/json

{
  "email": "seu-email@exemplo.com",
  "password": "sua-senha"
}
```

### 3. Crie uma trilha (já está autenticado via cookie)
```bash
POST http://localhost:8787/trails
Content-Type: application/json

{
  "name": "Trilha da Pedra Grande",
  "shortDescription": "Uma trilha desafiadora com vista panorâmica incrível da cidade.",
  "description": "Esta trilha leva você através da mata atlântica até o topo da Pedra Grande...",
  "duration": 180,
  "distance": 5.5,
  "difficulty": "moderado",
  "safetyTips": "Leve bastante água (mínimo 2 litros por pessoa)..."
}
```

**Resposta:** Você receberá o ID da trilha criada!

### 4. Faça upload da capa da trilha
```bash
POST http://localhost:8787/attachments?type=cover&trailId=1
Content-Type: multipart/form-data

[Arquivo de imagem no campo "file"]
```

### 5. (Opcional) Faça upload de imagens para a galeria
```bash
POST http://localhost:8787/attachments?type=galery&trailId=1
Content-Type: multipart/form-data

[Arquivo de imagem no campo "file"]
```

📚 **Veja mais detalhes em:** `UPLOAD_IMAGENS_TRILHAS.md`

## 🔍 Validações implementadas:

- ✅ **name**: mín 3, máx 100 caracteres
- ✅ **shortDescription**: mín 10, máx 500 caracteres (obrigatório)
- ✅ **description**: mín 10, máx 1000 caracteres (opcional)
- ✅ **duration**: número inteiro positivo (em minutos), mín 1, máx 10080 (1 semana)
- ✅ **distance**: número positivo (em km), mín 0.1, máx 1000
- ✅ **difficulty**: enum ['facil', 'moderado', 'dificil', 'muito_dificil']
- ✅ **safetyTips**: mín 10, máx 2000 caracteres (opcional)

## 🔐 Segurança:

- ✅ Rota protegida por autenticação JWT
- ✅ Trilha automaticamente vinculada à entidade logada
- ✅ Verifica se a entidade existe e não foi deletada antes de criar a trilha

## 🎉 Pronto!

Após executar os comandos de migration, a rota estará 100% funcional!

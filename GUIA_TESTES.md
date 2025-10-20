# 🧪 GUIA COMPLETO: Como Testar o Projeto

## ⚠️ ERRO ATUAL

Você está recebendo o erro:
```
"Erro interno do servidor: TypeError: Cannot read properties of undefined (reading 'includes')"
```

**Causa:** Provavelmente você não tem nenhum usuário cadastrado ainda!

---

## ✅ PASSO A PASSO PARA TESTAR CORRETAMENTE

### 📋 Pré-requisitos

1. Certifique-se de que executou as migrations:
```bash
npm run db:migrate:local
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Você deve ver algo como:
```
⛅️ wrangler 4.x.x
-------------------
Your worker has access to the following bindings:
- D1 Databases:
  - DB: interactive-trail-db (...)
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

---

## 🎯 TESTANDO AS ROTAS NA ORDEM CORRETA

### 1️⃣ PRIMEIRO: Criar uma conta (Signup)

**Por que?** Você precisa de um usuário para fazer login!

```http
POST http://localhost:8787/auth/signup
Content-Type: application/json

{
  "name": "João Silva",
  "nameComplement": "Filho",
  "email": "joao.silva@email.com",
  "password": "senhaSegura123",
  "zipCode": "12345678",
  "address": "Rua das Flores",
  "number": "123",
  "city": "São Paulo",
  "state": "SP",
  "addressComplement": "Apto 45",
  "phone": "11999999999"
}
```

**Resposta esperada (200 Created):**
```json
{
  "message": "Entity criada com sucesso",
  "user": {
    "name": "João Silva",
    "nameComplement": "Filho"
  }
}
```

**IMPORTANTE:** O signup já faz login automático e retorna um cookie `access_token`!

---

### 2️⃣ Login (se já tiver conta)

```http
POST http://localhost:8787/auth/login
Content-Type: application/json

{
  "email": "joao.silva@email.com",
  "password": "senhaSegura123"
}
```

**Resposta esperada (200 OK):**
```json
{
  "message": "Usuário logado com sucesso",
  "user": {
    "name": "João Silva",
    "nameComplement": "Filho",
    "coverUrl": null
  }
}
```

---

### 3️⃣ Criar uma Trilha (REQUER AUTENTICAÇÃO)

**IMPORTANTE:** Você precisa estar autenticado (ter feito login/signup antes)!

```http
POST http://localhost:8787/trails
Content-Type: application/json

{
  "name": "Trilha da Pedra Grande",
  "shortDescription": "Uma trilha desafiadora com vista panorâmica incrível da cidade.",
  "description": "Esta trilha leva você através da mata atlântica até o topo da Pedra Grande, onde você terá uma vista de 360 graus da região. O caminho é bem marcado mas possui trechos íngremes. Ideal para quem busca um desafio moderado e quer apreciar a natureza.",
  "duration": 180,
  "distance": 5.5,
  "difficulty": "moderado",
  "safetyTips": "Leve bastante água (mínimo 2 litros por pessoa), protetor solar, boné e lanches energéticos. Use calçados apropriados para trilha. Evite fazer a trilha em dias chuvosos pois o caminho fica escorregadio. Não se esqueça de levar repelente de insetos."
}
```

**Resposta esperada (201 Created):**
```json
{
  "message": "Trilha criada com sucesso",
  "trail": {
    "id": 1,
    "name": "Trilha da Pedra Grande",
    "description": "Esta trilha leva você...",
    "shortDescription": "Uma trilha desafiadora...",
    "duration": 180,
    "distance": 5,
    "difficulty": "moderado",
    "safetyTips": "Leve bastante água...",
    "entityId": 1,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**GUARDE O ID DA TRILHA!** Você vai precisar dele para fazer upload de imagens.

---

### 4️⃣ Upload de Capa da Trilha (REQUER AUTENTICAÇÃO)

**IMPORTANTE:** Use o ID da trilha criada no passo anterior!

No Postman/Insomnia:
1. Método: `POST`
2. URL: `http://localhost:8787/attachments?type=cover&trailId=1`
3. Body: `form-data`
4. Campo: `file` (tipo File)
5. Selecione uma imagem do seu computador

**Resposta esperada (201 Created):**
```json
{
  "message": "Upload realizado com sucesso"
}
```

---

### 5️⃣ Listar Trilhas de uma Entidade (PÚBLICO)

```http
GET http://localhost:8787/trails/1
```

**Resposta esperada (200 OK):**
```json
{
  "message": "Trilhas encontradas",
  "trails": [
    {
      "id": 1,
      "name": "Trilha da Pedra Grande",
      "description": "Esta trilha leva você...",
      "shortDescription": "Uma trilha desafiadora...",
      "duration": 180,
      "distance": 5,
      "difficulty": "moderado",
      "coverUrl": "uploads/trail/1/cover/a1b2c3d4-e5f6-..."
    }
  ]
}
```

---

## 🔧 TESTANDO COM POSTMAN/INSOMNIA

### Configurar Cookies (IMPORTANTE!)

Para que a autenticação funcione, você precisa habilitar cookies:

**Postman:**
1. Settings → General
2. Desmarque "Automatically follow redirects"
3. Marque "Send cookies"

**Insomnia:**
1. Preferences → Request/Response
2. Marque "Store cookies"

### Sequência de Testes:

```
1. POST /auth/signup   → Cria usuário e já autentica
2. POST /trails        → Cria trilha (usa cookie do step 1)
3. POST /attachments   → Upload de imagem (usa cookie do step 1)
4. GET /trails/1       → Lista trilhas (público, não precisa cookie)
```

---

## 🐛 RESOLVENDO O SEU ERRO ATUAL

O erro que você está tendo é porque:

1. **Você tentou fazer login ANTES de criar um usuário**
2. Ou o banco de dados está vazio

**Solução:**

1. Primeiro faça um **SIGNUP** (criar conta)
2. Depois você pode fazer **LOGIN** com essas credenciais

---

## 📝 TESTANDO COM cURL (Terminal)

### 1. Signup
```bash
curl -X POST http://localhost:8787/auth/signup \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "password": "senhaSegura123",
    "zipCode": "12345678",
    "address": "Rua das Flores",
    "number": "123",
    "city": "São Paulo",
    "state": "SP",
    "phone": "11999999999",
    "nameComplement": "Filho",
    "addressComplement": "Apto 45"
  }'
```

### 2. Criar Trilha
```bash
curl -X POST http://localhost:8787/trails \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Trilha Teste",
    "shortDescription": "Descrição curta da trilha",
    "duration": 120,
    "distance": 3.5,
    "difficulty": "facil"
  }'
```

### 3. Upload de Imagem
```bash
curl -X POST "http://localhost:8787/attachments?type=cover&trailId=1" \
  -b cookies.txt \
  -F "file=@/caminho/para/sua/imagem.jpg"
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de testar, verifique:

- [ ] Servidor rodando (`npm run dev`)
- [ ] Migrations aplicadas (`npm run db:migrate:local`)
- [ ] Cookies habilitados no cliente HTTP
- [ ] Testou signup ANTES de login
- [ ] Usou o ID correto da trilha no upload

---

## 🎯 RESUMO DO FLUXO

```
1. npm run dev              → Inicia servidor
2. POST /auth/signup        → Cria usuário (recebe cookie JWT)
3. POST /trails             → Cria trilha (usa cookie)
4. POST /attachments        → Upload imagem (usa cookie)
5. GET /trails/{entityId}   → Lista trilhas (público)
```

---

## ❓ Problemas Comuns

### "Credenciais Inválidas"
- Você digitou email ou senha errados
- Ou não existe usuário com esse email
- **Solução:** Faça signup primeiro!

### "Não autorizado" (401)
- O cookie JWT não está sendo enviado
- **Solução:** Habilite cookies no seu cliente HTTP

### "Entidade não encontrada" (404)
- Você tentou criar trilha sem estar autenticado
- **Solução:** Faça login/signup antes

### "Erro ao fazer upload"
- Arquivo muito grande (> 5MB)
- Não é uma imagem
- **Solução:** Use imagens JPG/PNG menores que 5MB

---

## 🎉 Pronto!

Agora você sabe como testar todas as rotas na ordem correta!

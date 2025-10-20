# 📸 Sistema de Upload de Imagens para Trilhas

## 🎯 Visão Geral

O sistema de upload foi atualizado para suportar imagens tanto de **entidades** quanto de **trilhas**. As imagens são armazenadas no **Cloudflare R2** (compatível com S3) e os metadados são salvos no banco de dados D1.

## 📂 Estrutura de Armazenamento

### Entidades
```
uploads/entity/{entityId}/{type}/{uuid}
```
Exemplo: `uploads/entity/1/cover/abc-123-def-456`

### Trilhas
```
uploads/trail/{trailId}/{type}/{uuid}
```
Exemplo: `uploads/trail/5/cover/xyz-789-abc-123`

## 🚀 Como Usar

### 1️⃣ Criar uma Trilha (sem imagem)

```http
POST http://localhost:8787/trails
Content-Type: application/json
Authorization: (automático via cookie JWT)

{
  "name": "Trilha da Pedra Grande",
  "shortDescription": "Uma trilha desafiadora com vista panorâmica incrível.",
  "description": "Descrição completa da trilha...",
  "duration": 180,
  "distance": 5.5,
  "difficulty": "moderado",
  "safetyTips": "Leve água, protetor solar..."
}
```

**Resposta:**
```json
{
  "message": "Trilha criada com sucesso",
  "trail": {
    "id": 5,
    "name": "Trilha da Pedra Grande",
    ...
  }
}
```

### 2️⃣ Fazer Upload da Capa da Trilha

**IMPORTANTE:** Use o `id` da trilha retornado no passo anterior!

```http
POST http://localhost:8787/attachments?type=cover&trailId=5
Content-Type: multipart/form-data
Authorization: (automático via cookie JWT)

[Arquivo da imagem no campo "file"]
```

### 3️⃣ Fazer Upload de Imagens da Galeria

Você pode fazer múltiplos uploads para a galeria:

```http
POST http://localhost:8787/attachments?type=galery&trailId=5
Content-Type: multipart/form-data
Authorization: (automático via cookie JWT)

[Arquivo da imagem no campo "file"]
```

## 📋 Parâmetros da Rota de Upload

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Valores | Descrição |
|-----------|------|-------------|---------|-----------|
| `type` | string | ✅ Sim | `cover`, `galery` | Tipo da imagem |
| `trailId` | string | ❌ Não* | número | ID da trilha |
| `entityId` | string | ❌ Não* | número | ID da entidade |

**\*Nota:** Você DEVE fornecer `trailId` OU `entityId`. Se não fornecer nenhum, será usado o ID da entidade logada.

### Body (multipart/form-data)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `file` | File | ✅ Sim | Arquivo de imagem (JPG, PNG, etc) |

## ✅ Validações

- ✅ **Content-Type:** Deve ser `multipart/form-data`
- ✅ **Tipo de arquivo:** Somente imagens (MIME type deve começar com `image/`)
- ✅ **Tamanho máximo:** 5MB
- ✅ **Autenticação:** Requer token JWT válido
- ✅ **Propriedade:** A trilha deve pertencer à entidade logada

## 📊 Fluxo Completo de Criação de Trilha com Imagens

```
1. Login/Signup → Recebe JWT Cookie
2. Criar Trilha → Recebe ID da trilha
3. Upload Capa → Anexa imagem de capa à trilha
4. Upload Galeria (opcional) → Anexa imagens à galeria da trilha
```

## 🔍 Como Consultar Trilhas com Imagens

```http
GET http://localhost:8787/trails/{entityId}
```

**Resposta:**
```json
{
  "message": "Trilhas encontradas",
  "trails": [
    {
      "id": 5,
      "name": "Trilha da Pedra Grande",
      "coverUrl": "uploads/trail/5/cover/abc-123-def-456",
      ...
    }
  ]
}
```

## 🗄️ Estrutura no Banco de Dados

### Tabela `attachments`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID único do anexo |
| `uuid` | text | UUID do arquivo |
| `bucket` | text | Nome do bucket R2 |
| `objectKey` | text | Caminho completo no R2 |
| `url` | text | URL de acesso (igual ao objectKey) |
| `mimeType` | text | Tipo MIME do arquivo |
| `size` | integer | Tamanho em bytes |
| `entityId` | integer | ID da entidade (se for anexo de entidade) |
| `trailId` | integer | ID da trilha (se for anexo de trilha) |
| `createdAt` | timestamp | Data de criação |
| `updatedAt` | timestamp | Data de atualização |

## 🔐 Segurança

- ✅ Todas as rotas de upload requerem autenticação JWT
- ✅ A entidade só pode fazer upload em trilhas que ela criou
- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Limitação de tamanho (5MB)
- ✅ UUID único para cada arquivo (evita conflitos)

## 🎨 Tipos de Imagem

### `cover` (Capa)
- Uma imagem principal da trilha
- Exibida como thumbnail/preview
- Pode ter apenas uma capa por trilha (a última sobrescreve)

### `galery` (Galeria)
- Múltiplas imagens da trilha
- Pode ter quantas quiser
- Exibidas em uma galeria de fotos

## 🧪 Testando com cURL

### Upload de Capa
```bash
curl -X POST "http://localhost:8787/attachments?type=cover&trailId=5" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/caminho/para/imagem.jpg" \
  --cookie "access_token=SEU_TOKEN_JWT"
```

### Upload de Galeria
```bash
curl -X POST "http://localhost:8787/attachments?type=galery&trailId=5" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/caminho/para/imagem.jpg" \
  --cookie "access_token=SEU_TOKEN_JWT"
```

## ⚠️ Tratamento de Erros

| Status | Erro | Solução |
|--------|------|---------|
| 400 | Content-Type inválido | Use `multipart/form-data` |
| 400 | Arquivo não encontrado | Certifique-se de usar o campo "file" |
| 400 | Não é imagem | Envie apenas arquivos de imagem |
| 401 | Não autorizado | Faça login primeiro |
| 413 | Arquivo muito grande | Reduza o tamanho para menos de 5MB |
| 500 | Erro interno | Verifique as credenciais do R2 |

## 🎉 Pronto!

Agora você pode criar trilhas com imagens completas! 🏔️📸

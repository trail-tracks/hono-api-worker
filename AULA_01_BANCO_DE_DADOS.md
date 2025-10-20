# 🗄️ ESTRUTURA DO BANCO DE DADOS - EXPLICAÇÃO DETALHADA

## 📋 Visão Geral das Tabelas

O projeto tem 3 tabelas principais:
1. **entities** - Organizações/Empresas que criam trilhas
2. **trails** - Trilhas criadas pelas entidades
3. **attachments** - Imagens e arquivos

---

## 🔗 Como as tabelas se relacionam?

```
entities (1) ----→ (N) trails
    |                   |
    |                   |
    └──→ (N) attachments ←──┘
```

### Explicação:
- 1 entidade pode ter MUITAS trilhas
- 1 entidade pode ter MUITAS imagens (capa, galeria)
- 1 trilha pode ter MUITAS imagens (capa, galeria)
- 1 imagem pertence a APENAS 1 entidade OU 1 trilha

---

## 📊 Tabela: entities (Organizações/Empresas)

```sql
CREATE TABLE entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único da entidade
  name TEXT NOT NULL,                    -- Nome (ex: "Parque Nacional")
  name_complement TEXT,                  -- Complemento (ex: "Unidade Sul")
  email TEXT UNIQUE NOT NULL,            -- Email para login
  password TEXT NOT NULL,                -- Senha (hash bcrypt)
  zip_code TEXT NOT NULL,                -- CEP
  address TEXT NOT NULL,                 -- Endereço
  number TEXT NOT NULL,                  -- Número
  city TEXT NOT NULL,                    -- Cidade
  state TEXT NOT NULL,                   -- Estado (ex: "SP")
  address_complement TEXT,               -- Complemento do endereço
  phone TEXT NOT NULL,                   -- Telefone
  deleted_at TEXT                        -- Data de exclusão (soft delete)
);
```

### Exemplo de registro:
```json
{
  "id": 1,
  "name": "Parque Estadual da Serra",
  "email": "contato@parque.com",
  "password": "$2a$12$hashaqui...",
  "city": "São Paulo",
  "state": "SP",
  "deleted_at": null  // null = ativo, com data = deletado
}
```

---

## 🥾 Tabela: trails (Trilhas)

```sql
CREATE TABLE trails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,              -- Nome da trilha
  description TEXT,                -- Descrição longa
  short_description TEXT,          -- Descrição curta
  duration INTEGER,                -- Duração em MINUTOS
  distance INTEGER,                -- Distância em KM
  difficulty TEXT,                 -- facil, moderado, dificil, muito_dificil
  safety_tips TEXT,                -- Dicas de segurança
  entity_id INTEGER,               -- FOREIGN KEY → entities(id)
  created_at INTEGER,              -- Data de criação
  updated_at INTEGER               -- Data de atualização
);
```

### Exemplo de registro:
```json
{
  "id": 5,
  "name": "Trilha da Pedra Grande",
  "short_description": "Vista panorâmica incrível",
  "duration": 180,      // 3 horas (180 minutos)
  "distance": 5,        // 5.5 km
  "difficulty": "moderado",
  "entity_id": 1,       // Pertence à entidade ID 1
  "safety_tips": "Leve água..."
}
```

### ⚠️ Relacionamento:
- `entity_id` → Aponta para `entities.id`
- Se a entidade for deletada, a trilha também é deletada (CASCADE)

---

## 📸 Tabela: attachments (Imagens/Arquivos)

```sql
CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT UNIQUE NOT NULL,       -- ID único do arquivo (gerado)
  bucket TEXT NOT NULL,            -- Nome do bucket R2
  object_key TEXT NOT NULL,        -- Caminho completo no R2
  mime_type TEXT,                  -- Tipo do arquivo (image/jpeg)
  size INTEGER,                    -- Tamanho em bytes
  url TEXT,                        -- URL de acesso
  entity_id INTEGER,               -- FOREIGN KEY → entities(id) [OPCIONAL]
  trail_id INTEGER,                -- FOREIGN KEY → trails(id) [OPCIONAL]
  created_at INTEGER,
  updated_at INTEGER
);
```

### 🔑 IMPORTANTE: entity_id OU trail_id

Uma imagem pode pertencer a:
- **Uma entidade** (capa ou galeria da empresa) → `entity_id` preenchido, `trail_id` = null
- **Uma trilha** (capa ou galeria da trilha) → `trail_id` preenchido, `entity_id` = null
- **NUNCA os dois ao mesmo tempo!**

### Exemplo 1: Imagem de ENTIDADE
```json
{
  "id": 10,
  "uuid": "abc-123-def-456",
  "bucket": "meu-bucket-r2",
  "object_key": "uploads/entity/1/cover/abc-123-def-456",
  "url": "uploads/entity/1/cover/abc-123-def-456",
  "mime_type": "image/jpeg",
  "size": 204800,  // 200KB
  "entity_id": 1,   // ← Pertence à entidade 1
  "trail_id": null  // ← NÃO pertence a trilha
}
```

### Exemplo 2: Imagem de TRILHA
```json
{
  "id": 11,
  "uuid": "xyz-789-ghi-012",
  "bucket": "meu-bucket-r2",
  "object_key": "uploads/trail/5/cover/xyz-789-ghi-012",
  "url": "uploads/trail/5/cover/xyz-789-ghi-012",
  "mime_type": "image/png",
  "size": 512000,   // 500KB
  "entity_id": null, // ← NÃO pertence à entidade
  "trail_id": 5      // ← Pertence à trilha 5
}
```

---

## 🎯 Como identificar o TIPO de imagem?

O tipo (cover ou galery) está no **caminho do arquivo** (object_key):

```
uploads/entity/1/cover/abc-123     → Capa da entidade 1
uploads/entity/1/galery/def-456    → Galeria da entidade 1
uploads/trail/5/cover/xyz-789      → Capa da trilha 5
uploads/trail/5/galery/ghi-012     → Galeria da trilha 5
```

---

## 🔍 Consultando dados com relacionamentos

### Listar trilhas com suas capas:
```typescript
const trailsWithCovers = await db
  .select({
    id: trail.id,
    name: trail.name,
    coverUrl: attachment.url,
  })
  .from(trail)
  .leftJoin(attachment, eq(trail.id, attachment.trailId))
  .where(like(attachment.url, '%/cover/%'));  // Só capas
```

---

## ✅ Resumo:

1. **entities** = Empresas/Organizações (usuários do sistema)
2. **trails** = Trilhas criadas pelas entidades
3. **attachments** = Imagens que podem pertencer a entidades OU trilhas
4. **NÃO existe campo "imagem" nas tabelas entities ou trails**
5. **As imagens são buscadas pela tabela attachments usando entity_id ou trail_id**

---

## 🗑️ Soft Delete

Note que `entities` tem campo `deleted_at`:
- `deleted_at = null` → Entidade ATIVA
- `deleted_at = "2025-01-15T10:30:00"` → Entidade DELETADA

Por que? Para não perder histórico! A entidade continua no banco mas não aparece nas consultas.

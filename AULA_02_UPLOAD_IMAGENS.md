# 🎓 AULA 02: Entendendo o Sistema de Upload de Imagens

## 🎯 Visão Geral

O sistema de upload faz 3 coisas:
1. Recebe uma imagem do usuário
2. Envia para o Cloudflare R2 (armazenamento)
3. Salva as informações no banco D1

---

## 📂 Onde as imagens ficam armazenadas?

### R2 (Cloudflare R2 - Armazenamento de Objetos)

```
Bucket R2 (como um "HD na nuvem")
│
└── uploads/
    ├── entity/
    │   ├── 1/
    │   │   ├── cover/
    │   │   │   └── abc-123-def-456.jpg  ← Capa da entidade 1
    │   │   └── galery/
    │   │       ├── ghi-789.jpg
    │   │       └── jkl-012.png
    │   └── 2/
    │       └── cover/
    │           └── mno-345.jpg
    │
    └── trail/
        ├── 5/
        │   ├── cover/
        │   │   └── pqr-678.jpg  ← Capa da trilha 5
        │   └── galery/
        │       ├── stu-901.jpg
        │       └── vwx-234.jpg
        └── 6/
            └── cover/
                └── yza-567.png
```

### D1 (Banco de Dados - Metadados)

As **informações** sobre as imagens ficam no banco:

| id | uuid | object_key | entity_id | trail_id | size |
|----|------|-----------|-----------|----------|------|
| 1 | abc-123 | uploads/entity/1/cover/abc-123 | 1 | null | 204800 |
| 2 | pqr-678 | uploads/trail/5/cover/pqr-678 | null | 5 | 512000 |

---

## 🔄 Fluxo Completo do Upload

### Passo a Passo:

```
1. Usuário seleciona imagem no frontend
                ↓
2. Frontend faz POST /attachments?type=cover&trailId=5
                ↓
3. AttachmentsController recebe a requisição
                ↓
4. Valida: é imagem? < 5MB? usuário autenticado?
                ↓
5. Chama UploadAttachmentUseCase.execute()
                ↓
6. UseCase faz 2 coisas em paralelo:
   a) Envia arquivo para R2
   b) Salva metadados no D1
                ↓
7. Retorna sucesso para o frontend
```

---

## 📝 Análise do Código: upload-attachment.use-case.ts

Vou explicar o código linha por linha:

### Parte 1: Interface de Entrada

```typescript
export interface UploadAttachmentUseCaseInput {
  d1Database: D1Database;        // Conexão com o banco D1
  file: File;                    // Arquivo de imagem do usuário
  bucket: string;                // Nome do bucket R2 (ex: "meu-bucket")
  accountId: string;             // ID da conta Cloudflare
  accessKeyId: string;           // Chave de acesso R2 (como username)
  secretAccessKey: string;       // Chave secreta R2 (como senha)
  type: 'galery' | 'cover';      // Tipo da imagem
  entityId?: number;             // ID da entidade (opcional)
  trailId?: number;              // ID da trilha (opcional)
}
```

**Por que tantos parâmetros?**
- Para conectar no R2, precisamos das credenciais (accountId, accessKeyId, secretAccessKey)
- Para salvar no banco, precisamos do d1Database
- Para organizar as imagens, precisamos saber se é entity ou trail

---

### Parte 2: Criando Cliente S3

```typescript
private static createClient(params: {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}) {
  const { accountId, accessKeyId, secretAccessKey } = params;

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}
```

**O que está acontecendo?**
- R2 é compatível com S3 (serviço da Amazon)
- Usamos a biblioteca `@aws-sdk/client-s3` para se conectar
- `endpoint` é o endereço do R2 da Cloudflare
- `credentials` são como username e senha

---

### Parte 3: Método Principal (execute)

```typescript
static async execute(params: UploadAttachmentUseCaseInput): Promise<UploadAttachmentUseCaseResponse> {
  
  const { d1Database, file, bucket, accountId, accessKeyId, secretAccessKey } = params;

  // 1. Preparar conexão com banco
  UploadAttachmentUseCase.db = getDb(d1Database);
  
  // 2. Pegar tipo MIME (image/jpeg, image/png, etc)
  const contentType = file.type || 'application/octet-stream';
  
  // 3. Definir pasta base
  const baseObjectKey: string = 'uploads';

  try {
    // 4. Converter arquivo para bytes
    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);

    // 5. Criar cliente S3
    const client = this.createClient({ accountId, accessKeyId, secretAccessKey });

    // 6. Se for imagem de ENTIDADE
    if (params.entityId) {
      const entityObjectKey = `${baseObjectKey}/entity`;
      await this.saveEntityPicture(
        client,
        bucket,
        body,
        contentType,
        params.type,
        params.entityId,
        entityObjectKey,
        file.size,
      );
    }

    // 7. Se for imagem de TRILHA
    if (params.trailId) {
      const trailObjectKey = `${baseObjectKey}/trail`;
      await this.saveTrailPicture(
        client,
        bucket,
        body,
        contentType,
        params.type,
        params.trailId,
        trailObjectKey,
        file.size,
      );
    }

    return { success: true };
  } catch (error) {
    console.error('UploadAttachmentUseCase error:', error);
    return {
      success: false,
      error: {
        message: 'Não foi possível processar o upload do anexo',
        statusCode: 500,
      },
    };
  }
}
```

**Explicação passo a passo:**

1. **Linha 1-5**: Extrair parâmetros necessários
2. **Linha 7**: `getDb(d1Database)` cria conexão com Drizzle ORM
3. **Linha 10**: Pegar tipo do arquivo (MIME type)
4. **Linha 16-17**: Converter File para array de bytes (formato que o R2 entende)
5. **Linha 20**: Criar cliente para se conectar ao R2
6. **Linha 23-32**: Se tiver `entityId`, salva como imagem de entidade
7. **Linha 35-44**: Se tiver `trailId`, salva como imagem de trilha

---

### Parte 4: Salvando Imagem de Trilha

```typescript
private static async saveTrailPicture(
  client: S3Client,          // Cliente conectado ao R2
  bucket: string,            // Nome do bucket
  body: Uint8Array,          // Bytes da imagem
  contentType: string,       // image/jpeg
  type: 'galery' | 'cover',  // Tipo
  trailId: number,           // ID da trilha
  baseObjectKey: string,     // "uploads/trail"
  fileSize: number,          // Tamanho em bytes
): Promise<void> {
  // 1. Gerar UUID único para o arquivo
  const uuid = crypto.randomUUID();
  // Resultado: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

  // 2. Montar caminho completo
  const objectKey = `${baseObjectKey}/${trailId}/${type}/${uuid}`;
  // Resultado: "uploads/trail/5/cover/a1b2c3d4-e5f6-7890-abcd-ef1234567890"

  // 3. Enviar arquivo para o R2
  await client.send(new PutObjectCommand({
    Bucket: bucket,           // Nome do bucket R2
    Key: objectKey,           // Caminho do arquivo
    Body: body,               // Bytes da imagem
    ContentType: contentType, // Tipo do arquivo
  }));

  // 4. Salvar metadados no banco D1
  const now = new Date();

  await this.db
    .insert(attachment)
    .values({
      uuid,                // UUID gerado
      bucket,              // Nome do bucket
      objectKey,           // Caminho completo
      mimeType: contentType,
      size: fileSize,
      url: objectKey,      // Mesmo que objectKey
      trailId,             // ID da trilha (IMPORTANTE!)
      createdAt: now,
      updatedAt: now,
    })
    .returning({
      uuid: attachment.uuid,
      bucket: attachment.bucket,
      objectKey: attachment.objectKey,
      url: attachment.url,
      mimeType: attachment.mimeType,
      size: attachment.size,
    })
    .get();
}
```

**Explicação linha a linha:**

1. **Linha 12**: `crypto.randomUUID()` gera ID único (ex: "a1b2-c3d4...")
2. **Linha 16**: Monta caminho: `uploads/trail/5/cover/a1b2-c3d4`
3. **Linha 20-25**: `PutObjectCommand` envia arquivo para R2
4. **Linha 30-50**: Insere registro no banco com `.insert(attachment).values(...)`

---

## 🔑 Conceitos Importantes

### UUID (Universally Unique Identifier)
- É um ID único gerado aleatoriamente
- Exemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- Garante que dois arquivos nunca tenham o mesmo nome

### MIME Type
- Identifica o tipo do arquivo
- `image/jpeg` → JPG
- `image/png` → PNG
- `image/gif` → GIF

### ArrayBuffer / Uint8Array
- São formatos de bytes em JavaScript
- Necessários para enviar dados binários (imagens) pela rede

---

## 🎯 Resumo do Fluxo

```
1. Usuário envia imagem
↓
2. Controller valida (tamanho, tipo, auth)
↓
3. UseCase gera UUID único
↓
4. UseCase envia para R2 com PutObjectCommand
   Arquivo fica em: uploads/trail/5/cover/{uuid}
↓
5. UseCase salva metadados no banco D1
   Registro criado na tabela attachments
↓
6. Retorna sucesso
```

---

## ❓ Perguntas Comuns

**Q: Por que usar UUID e não o nome original do arquivo?**
A: Para evitar conflitos. Se dois usuários enviarem "foto.jpg", teríamos problema!

**Q: Por que salvar no R2 E no banco?**
A: R2 guarda o arquivo (bytes). Banco guarda as informações (tamanho, data, dono).

**Q: O que acontece se o upload para R2 falhar?**
A: O `try/catch` captura o erro e retorna `success: false`. Nada é salvo no banco.

**Q: Posso deletar uma imagem?**
A: Não há rota implementada ainda, mas seria necessário deletar do R2 E do banco.

---

## 🔗 Próxima Aula

Na próxima aula vamos entender:
- O que são os arquivos de ambiente (.env.local vs env.ts)
- O que é polyfills
- Como testar as rotas

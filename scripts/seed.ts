/* eslint-disable no-plusplus */
/* eslint-disable no-multi-assign */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto'; // Import necessário para o campo uuid
import { hash } from 'bcryptjs';

// Carrega variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Configuração
const CONFIG = {
  DB_NAME: 'interactive-trail-db',
  BUCKET_NAME: process.env.R2_BUCKET,
  ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  COUNTS: {
    ENTITIES: 3,
    TRAILS_PER_ENTITY: 3,
    POIS_PER_TRAIL: 2,
  },
};

if (!CONFIG.BUCKET_NAME || !CONFIG.ACCOUNT_ID || !CONFIG.ACCESS_KEY_ID || !CONFIG.SECRET_ACCESS_KEY) {
  console.error('❌ Erro: Variáveis de ambiente do R2 não configuradas.');
  process.exit(1);
}

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${CONFIG.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CONFIG.ACCESS_KEY_ID,
    secretAccessKey: CONFIG.SECRET_ACCESS_KEY,
  },
});

// Função para upload retorna metadados necessários para o banco
async function uploadFile(filename: string, folder: string, id: number) {
  const localPath = path.join(process.cwd(), 'seed-assets', filename);

  // Fallback se arquivo não existir
  if (!existsSync(localPath)) {
    console.warn(`⚠️ Arquivo ${filename} não encontrado. Usando placeholder.`);
    return {
      key: `placeholder/${filename}`,
      size: 0,
      url: `${CONFIG.R2_PUBLIC_URL}/placeholder.png`,
    };
  }

  const fileContent = readFileSync(localPath);
  const key = `${folder}/${id}-${Date.now()}-${filename}`;

  await S3.send(
    new PutObjectCommand({
      Bucket: CONFIG.BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: 'image/png',
    }),
  );

  // Ajuste a URL pública conforme sua configuração de domínio do R2
  const publicUrl = `${CONFIG.R2_PUBLIC_URL}/${key}`;

  return {
    key,
    size: fileContent.length,
    url: publicUrl,
  };
}

const sqlStr = (str: string) => `'${str.replace(/'/g, "''")}'`;

async function main() {
  console.log('🌱 Iniciando Seed...');
  const sqlStatements: string[] = [];

  // Limpeza das tabelas
  sqlStatements.push('DELETE FROM attachments;');
  sqlStatements.push('DELETE FROM points_of_interest;');
  sqlStatements.push('DELETE FROM trails;');
  sqlStatements.push('DELETE FROM entities;');
  sqlStatements.push('DELETE FROM sqlite_sequence WHERE name IN (\'entities\', \'trails\', \'points_of_interest\', \'attachments\');');

  let entityIdCounter = 1;
  let trailIdCounter = 1;
  let poiIdCounter = 1;

  // --- ENTIDADES ---
  for (let i = 1; i <= CONFIG.COUNTS.ENTITIES; i++) {
    const eId = entityIdCounter++;
    console.log(`   Criando Entidade ${i}...`);

    sqlStatements.push(`
      INSERT INTO entities (id, name, email, password, zip_code, address, number, city, state, phone)
      VALUES (
        ${eId}, 
        ${sqlStr(`Entidade Teste ${i}`)}, 
        ${sqlStr(`entidade${i}@teste.com`)}, 
        ${sqlStr(await hash('senha123', 10))}, 
        '12345-678', 'Rua das Flores', '100', 'São Paulo', 'SP', '11999999999'
      );
    `);

    // Upload Foto Entidade
    const entImg = await uploadFile('entity.png', 'entities', eId);

    // Insert Attachment (Schema Correto)
    sqlStatements.push(`
      INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, entity_id) 
      VALUES (
        ${sqlStr(randomUUID())},
        ${sqlStr(CONFIG.BUCKET_NAME!)},
        ${sqlStr(entImg.key)},
        'image/png',
        ${entImg.size},
        ${sqlStr(entImg.url)},
        ${eId}
      );
    `);

    // --- TRILHAS ---
    for (let j = 1; j <= CONFIG.COUNTS.TRAILS_PER_ENTITY; j++) {
      const tId = trailIdCounter++;

      sqlStatements.push(`
        INSERT INTO trails (id, name, short_description, duration, distance, difficulty, entity_id)
        VALUES (
          ${tId}, 
          ${sqlStr(`Trilha ${j} da Entidade ${i}`)}, 
          ${sqlStr('Uma trilha muito legal com belas vistas.')}, 
          '2h 30m', '5.5km', 'Média', ${eId}
        );
      `);

      // Upload Foto Capa Trilha
      const trailImg = await uploadFile('trail.png', 'trails/cover', tId);

      sqlStatements.push(`
        INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, trail_id) 
        VALUES (
          ${sqlStr(randomUUID())},
          ${sqlStr(CONFIG.BUCKET_NAME!)},
          ${sqlStr(trailImg.key)},
          'image/png',
          ${trailImg.size},
          ${sqlStr(trailImg.url)},
          ${tId}
        );
      `);

      // --- PONTOS DE INTERESSE ---
      for (let k = 1; k <= CONFIG.COUNTS.POIS_PER_TRAIL; k++) {
        const pId = poiIdCounter++;

        sqlStatements.push(`
          INSERT INTO points_of_interest (id, name, description, short_description, trail_id)
          VALUES (
            ${pId}, 
            ${sqlStr(`Ponto ${k} da Trilha ${j}`)}, 
            ${sqlStr('Um ponto interessante para tirar fotos.')}, 
            ${sqlStr('Um ponto interessante para tirar fotos.')}, 
            ${tId}
          );
        `);

        // Upload Foto POI
        const poiImg = await uploadFile('poi.png', 'pois', pId);

        sqlStatements.push(`
          INSERT INTO attachments (uuid, bucket, object_key, mime_type, size, url, point_of_interest_id) 
          VALUES (
            ${sqlStr(randomUUID())},
            ${sqlStr(CONFIG.BUCKET_NAME!)},
            ${sqlStr(poiImg.key)},
            'image/png',
            ${poiImg.size},
            ${sqlStr(poiImg.url)},
            ${pId}
          );
        `);
      }
    }
  }

  const sqlContent = sqlStatements.join('\n');
  writeFileSync('seed.sql', sqlContent);
  console.log('📄 Arquivo seed.sql gerado com sucesso.');

  console.log('🚀 Executando SQL no D1 (Local)...');
  try {
    execSync(`npx wrangler d1 execute ${CONFIG.DB_NAME} --local --file=./seed.sql`, { stdio: 'inherit' });
    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar SQL no D1:', error);
  }
}

main();

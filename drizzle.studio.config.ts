import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/2c9a28ef-a1f6-443d-adc9-508356bb2eb1.sqlite',
  },
  verbose: true,
  strict: true,
});

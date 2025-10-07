import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/e486a1092c207cfd1feb5f9a26002dfdc66be52f72e13662ce0a65434df92be0.sqlite',
  },
});

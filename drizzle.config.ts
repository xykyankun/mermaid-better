import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/neon/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});


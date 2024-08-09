import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/database/schemas.ts',
  out: './drizzle',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
} satisfies Config;
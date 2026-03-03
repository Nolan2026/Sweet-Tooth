import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export default defineConfig({
    datasource: {
        provider: "postgresql",
        url: process.env.DATABASE_URL,
    },
});

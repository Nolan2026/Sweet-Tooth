import pkgClient from '@prisma/client';
const { PrismaClient } = pkgClient;
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log("Database Connected successfully");

export default prisma;

import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();
console.log(Object.keys(prisma));

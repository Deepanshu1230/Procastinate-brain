import dotenv from 'dotenv';
dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable: ${name}`);
  return value;
}

export const PORT = getEnv("PORT") || 3000;
export const DB_URL = getEnv("DATA_BASE_URL");
export const JWT_SECRET=getEnv("JWT_TOKEN");
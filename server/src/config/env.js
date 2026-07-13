import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const booleanFromString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const optionalPort = z
  .string()
  .optional()
  .transform((value) => (value ? Number(value) : undefined));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().min(1).default('vertex'),
  DB_USER: z.string().min(1).default('root'),
  DB_PASSWORD: z.string().default(''),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
  PASSWORD_RESET_SECRET: z.string().min(32, 'PASSWORD_RESET_SECRET must be at least 32 characters'),
  PASSWORD_RESET_EXPIRES_IN: z.string().min(1).default('15m'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: optionalPort,
  SMTP_SECURE: booleanFromString.default('false'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().min(1).default('NexaCode Labs <no-reply@nexacodelabs.local>'),
  DEV_LOG_EMAIL_CONTENT: booleanFromString.default('false'),
  COOKIE_NAME: z.string().min(1).default('nexacode_refresh_token'),
  COOKIE_SECURE: booleanFromString.default('false'),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formatted = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid server environment configuration:\n${formatted}`);
}

export const env = parsedEnv.data;

export function isProduction() {
  return env.NODE_ENV === 'production';
}

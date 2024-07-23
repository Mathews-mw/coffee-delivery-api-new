import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'qas', 'production']).default('dev'),
	PORT: z.coerce.number().default(3737),
	HOST: z.string(),
	DATABASE_URL: z.string(),
	COOKIE_NAME: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.log('❌ Invalid environment variables', _env.error.format());

	throw new Error('Invalid environment variables');
}

export const env = _env.data;

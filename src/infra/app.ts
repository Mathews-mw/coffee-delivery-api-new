import 'reflect-metadata';
import '@/shared/containers/index'; // DI Containers

import fastify from 'fastify';
import { ZodError } from 'zod';
import cors from '@fastify/cors';
import multer from 'fastify-multer';
import fastifyJwt from '@fastify/jwt';
import { readFileSync } from 'node:fs';
import formBody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';

import { env } from './env';
import { routes } from './http/routes/index.routes';
import path from 'node:path';
import { cwd } from 'node:process';

export const app = fastify();

app.register(fastifyCookie);

app.register(cors, {
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
	origin: ['http://localhost:3000'],
});

app.register(fastifyJwt, {
	secret: {
		private: readFileSync(path.resolve(cwd(), 'jwtRS256.key'), 'utf8'),
		public: readFileSync(path.resolve(cwd(), 'jwtRS256.key.pub'), 'utf8'),
	},
	cookie: {
		cookieName: env.COOKIE_NAME,
		signed: false,
	},
	sign: {
		expiresIn: '10m',
		algorithm: 'RS256',
	},
});

app.register(formBody);
app.register(multer.contentParser);

app.register(routes, { prefix: '/api' });

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		console.log('zod errors: ', error);
		return reply.status(400).send({ message: 'Erro de validação.', issues: error.format() });
	}

	if (env.NODE_ENV !== 'production') {
		console.log('handler error:', error);
	}

	return reply.status(500).send({ message: 'Internal server error.' });
});

// graceful shutdown
const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
	process.on(signal, async () => {
		await app.close();
		process.exit(0);
	});
});

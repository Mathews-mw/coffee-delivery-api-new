import 'reflect-metadata';

import fastify from 'fastify';
import { ZodError } from 'zod';
import cors from '@fastify/cors';

import { env } from './env';
import { routes } from './http/routes/index.routes';

export const app = fastify();

app.register(cors, {
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
	origin: ['*'],
});

app.register(routes, { prefix: '/api' });

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ message: 'Erro de validação.', issues: error.format() });
	}

	if (env.NODE_ENV !== 'production') {
		console.log('handler error:', error);
	}

	return reply.status(500).send({ message: 'Internal server error.' });
});

import { FastifyInstance } from 'fastify';

import { apiHealthCheck } from './api-health-check.routes';

export async function routes(app: FastifyInstance) {
	app.register(apiHealthCheck, { prefix: '/health-check' });
}

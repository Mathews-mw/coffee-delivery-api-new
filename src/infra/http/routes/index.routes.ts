import { FastifyInstance } from 'fastify';

import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { attachmentsRoutes } from './attachments.routes';
import { apiHealthCheck } from './api-health-check.routes';
import { tagsRoutes } from './tags.routes';
import { productsRoutes } from './products.routes';

export async function routes(app: FastifyInstance) {
	app.register(apiHealthCheck, { prefix: '/health-check' });

	app.register(authRoutes, { prefix: '/auth' });

	app.register(usersRoutes, { prefix: '/users' });
	app.register(attachmentsRoutes, { prefix: '/attachments' });
	app.register(tagsRoutes, { prefix: '/tags' });
	app.register(productsRoutes, { prefix: '/products' });
}

import { FastifyInstance } from 'fastify';
import { createTagController } from '../controllers/tags/create-tag-controller';

export async function tagsRoutes(app: FastifyInstance) {
	app.post('/', createTagController);
}

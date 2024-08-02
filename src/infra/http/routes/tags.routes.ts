import { FastifyInstance } from 'fastify';

import { createTagController } from '../controllers/tags/create-tag-controller';
import { ListingTagsController } from '../controllers/tags/listing-tags-controller';

export async function tagsRoutes(app: FastifyInstance) {
	app.post('/', createTagController);

	app.get('/', ListingTagsController);
}

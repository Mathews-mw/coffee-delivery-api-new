import { FastifyInstance } from 'fastify';

import { createProductController } from '../controllers/products/create-product-controller';

export async function productsRoutes(app: FastifyInstance) {
	app.post('/', createProductController);
}

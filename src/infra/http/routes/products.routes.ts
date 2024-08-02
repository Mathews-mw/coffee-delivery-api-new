import { FastifyInstance } from 'fastify';

import { createProductController } from '../controllers/products/create-product-controller';
import { ListingProductsController } from '../controllers/products/listing-products-controller';

export async function productsRoutes(app: FastifyInstance) {
	app.post('/', createProductController);

	app.get('/', ListingProductsController);
}

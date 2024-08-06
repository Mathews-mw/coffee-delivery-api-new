import { FastifyInstance } from 'fastify';

import { editProductController } from '../controllers/products/edit-product-controller';
import { createProductController } from '../controllers/products/create-product-controller';
import { listingProductsController } from '../controllers/products/listing-products-controller';
import { getProductDetailsController } from '../controllers/products/get-product-details-controller';

export async function productsRoutes(app: FastifyInstance) {
	app.post('/', createProductController);
	app.put('/:product_id/edit', editProductController);

	app.get('/', listingProductsController);
	app.get('/:product_id/details', getProductDetailsController);
}

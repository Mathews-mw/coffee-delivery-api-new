import multer from 'fastify-multer';
import { FastifyInstance } from 'fastify';

import { uploadProductImageController } from '../controllers/products/upload-product-image-controller';

export async function attachmentsRoutes(app: FastifyInstance) {
	app.post('/product-image', { preHandler: multer().single('file') }, uploadProductImageController);
}

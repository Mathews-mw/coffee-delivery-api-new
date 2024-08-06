import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ProductDetailsPresenter } from '../../presenters/product/product-details-presenter';
import { GetProductDetailsUseCase } from '@/domains/main/application/modules/products/use-cases/get-product-details-use-case';

export async function getProductDetailsController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const paramsSchema = z.object({
		product_id: z.string().uuid(),
	});

	const { product_id } = paramsSchema.parse(request.params);

	try {
		const service = container.resolve(GetProductDetailsUseCase);

		const result = await service.execute({
			productId: product_id,
		});

		if (result.isFalse()) {
			return reply.status(404).send({ message: result.value.message });
		}

		return reply.status(200).send(ProductDetailsPresenter.toHTTP(result.value.product));
	} catch (error) {
		console.log('GetProductDetailsController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar buscar por produto.' });
	}
}

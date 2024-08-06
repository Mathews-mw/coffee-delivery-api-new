import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { ProductDetailsPresenter } from '../../presenters/product/product-details-presenter';
import { ListingProductsUseCase } from '@/domains/main/application/modules/products/use-cases/listing-products-use-case';

export async function listingProductsController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const registerBodySchema = z.object({
		page: z.optional(z.coerce.number()).default(1),
		per_page: z.optional(z.coerce.number()).default(10),
		search: z.optional(z.string()),
	});

	const { page, per_page, search } = registerBodySchema.parse(request.query);

	try {
		const service = container.resolve(ListingProductsUseCase);

		const result = await service.execute({
			page,
			perPage: per_page,
			search,
		});

		if (result.isFalse()) {
			return reply.status(400).send();
		}

		const response = {
			pagination: PaginationPresenter.toHTTP(result.value.pagination),
			products: result.value.products.map(ProductDetailsPresenter.toHTTP),
		};

		// await new Promise((resolve) => setTimeout(resolve, 3000));

		return reply.status(200).send(response);
	} catch (error) {
		console.log('ListingProductsController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar listar produtos.' });
	}
}

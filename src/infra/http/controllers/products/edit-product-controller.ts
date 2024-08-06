import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ProductPresenter } from '../../presenters/product/product-presenter';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { EditProductUseCase } from '@/domains/main/application/modules/products/use-cases/edit-product-use-case';
import { ProductAlreadyExistsError } from '@/domains/main/application/modules/products/use-cases/errors/product-already-exists-error';
import { NegativaValueNotAllowedError } from '@/domains/main/application/modules/products/use-cases/errors/negative-value-not-allowed-error';

export async function editProductController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	console.log('request body: ', request.body);

	const bodySchema = z.object({
		name: z.string().optional(),
		price: z.coerce.number().optional(),
		description: z.string().optional(),
		available: z.coerce.boolean().optional(),
		tags_id: z.array(z.string()).optional(),
		attachment_id: z.string().optional(),
	});
	const paramsSchema = z.object({
		product_id: z.string().uuid(),
	});

	const { product_id } = paramsSchema.parse(request.params);
	const { name, price, description, tags_id, available, attachment_id } = bodySchema.parse(request.body);

	try {
		const service = container.resolve(EditProductUseCase);

		const result = await service.execute({
			productId: product_id,
			name,
			price,
			description,
			tagsId: tags_id,
			available,
			attachmentId: attachment_id,
		});

		if (result.isFalse()) {
			const error = result.value;
			switch (error.constructor) {
				case ResourceNotFoundError:
					return reply.status(404).send({ message: error.message });
				case ProductAlreadyExistsError:
					return reply.status(400).send({ message: error.message });
				case NegativaValueNotAllowedError:
					return reply.status(400).send({ message: error.message });
				default:
					return reply.status(400).send();
			}
		}

		return reply.status(200).send(ProductPresenter.toHTTP(result.value.product));
	} catch (error) {
		console.log('editProductController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar editar produto.' });
	}
}

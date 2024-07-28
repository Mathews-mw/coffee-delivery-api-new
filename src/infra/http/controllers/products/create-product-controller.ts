import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProductUseCase } from '@/domains/main/application/modules/products/use-cases/create-product-use-case';

export async function createProductController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const registerBodySchema = z.object({
		name: z.string(),
		price: z.coerce.number(),
		description: z.string(),
		tags_id: z.array(z.string()),
		attachment_id: z.string(),
	});

	const { name, price, description, tags_id, attachment_id } = registerBodySchema.parse(request.body);

	try {
		const service = container.resolve(CreateProductUseCase);

		const result = await service.execute({
			name,
			price,
			description,
			tagsId: tags_id,
			attachmentId: attachment_id,
		});

		if (result.isFalse()) {
			return reply.status(400).send({ message: result.value.message });
		}

		return reply.status(201).send(result.value.product);
	} catch (error) {
		console.log('createProductController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar cadastrar produto.' });
	}
}

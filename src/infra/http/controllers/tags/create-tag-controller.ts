import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateTagUseCase } from '@/domains/main/application/modules/tag/use-cases/create-tag-use-case';

export async function createTagController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const registerBodySchema = z.object({
		tag_name: z.string(),
	});

	const { tag_name } = registerBodySchema.parse(request.body);

	try {
		const service = container.resolve(CreateTagUseCase);

		const result = await service.execute({
			tagName: tag_name,
		});

		if (result.isFalse()) {
			return reply.status(400).send({ message: result.value.message });
		}

		return reply.status(201).send(result.value.tag);
	} catch (error) {
		console.log('createTagController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar cadastrar tag.' });
	}
}

import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { TagPresenter } from '../../presenters/product/tag-presenter';
import { ListingTagsUseCase } from '@/domains/main/application/modules/tag/use-cases/listing-tags-use-case';

export async function ListingTagsController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	try {
		const service = container.resolve(ListingTagsUseCase);

		const result = await service.execute({});

		if (result.isFalse()) {
			return reply.status(400).send();
		}

		const response = {
			tags: result.value.tags.map(TagPresenter.toHTTP),
		};

		return reply.status(201).send(response.tags);
	} catch (error) {
		console.log('ListingTagsController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar listar tags.' });
	}
}

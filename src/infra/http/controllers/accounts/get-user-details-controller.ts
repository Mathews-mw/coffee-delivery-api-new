import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GetUserDetailsUseCase } from '@/domains/main/application/modules/accounts/use-cases/get-user-details-use-case';

export async function getUserDetailsController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const { sub: userId } = request.user;

	try {
		const service = container.resolve(GetUserDetailsUseCase);

		const result = await service.execute({
			userId,
		});

		if (result.isFalse()) {
			return reply.status(404).send({ message: result.value.message });
		}

		return reply.status(200).send(result.value.user);
	} catch (error) {
		console.log('getUserDetailsController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar buscar por usuário.' });
	}
}

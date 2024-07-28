import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { userRolesTypes } from '@/domains/main/resources/entities/user';
import { CreateUserUseCase } from '@/domains/main/application/modules/accounts/use-cases/create-user-use-case';

export async function createUserController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().optional(),
		role: z
			.enum([...userRolesTypes])
			.optional()
			.default('CUSTOMER'),
	});

	const { name, email, password, role } = registerBodySchema.parse(request.body);

	try {
		const service = container.resolve(CreateUserUseCase);

		const result = await service.execute({
			name,
			email,
			password,
			role,
		});

		if (result.isFalse()) {
			return reply.status(400).send({ status: 400, statusText: 'Bad Request', message: result.value.message });
		}

		return reply.status(201).send(result.value.user);
	} catch (error) {
		console.log('createUserController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar cadastrar usuário.' });
	}
}

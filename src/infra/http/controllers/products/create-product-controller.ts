import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProductUseCase } from '@/domains/main/application/modules/products/use-cases/create-product-use-case';

export async function createProductController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().optional(),
	});

	const { name, email, password, role } = registerBodySchema.parse(request.body);

	try {
		const service = container.resolve(CreateProductUseCase);

		const result = await service.execute({
			name,
			email,
			password,
			role,
		});

		if (result.isFalse()) {
			return reply.status(400).send({ message: result.value.message });
		}

		return reply.status(201).send(result.value.product);
	} catch (error) {
		console.log('createProductController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar cadastrar usuário.' });
	}
}

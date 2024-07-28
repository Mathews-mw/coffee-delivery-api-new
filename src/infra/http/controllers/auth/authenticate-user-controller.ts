import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/infra/env';
import { AuthenticateUserUseCase } from '@/domains/main/application/modules/auth/authenticate-user-use-case';
import { RegisterUserSessionUseCase } from '@/domains/main/application/modules/auth/register-user-session-use-case';
import { UserPresenter } from '../../presenters/account/user-presenter';

export async function authenticateUserController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const registerBodySchema = z.object({
		email: z.string().email(),
		password: z.string(),
	});

	const { email, password } = registerBodySchema.parse(request.body);

	try {
		const authService = container.resolve(AuthenticateUserUseCase);
		const sessionService = container.resolve(RegisterUserSessionUseCase);

		const authResult = await authService.execute({
			email,
			password,
		});

		if (authResult.isFalse()) {
			return reply.status(401).send({ message: authResult.value.message });
		}

		const { user } = authResult.value;

		const token = await reply.jwtSign({ role: user.role }, { sign: { sub: user.id.toString() } });

		const sessionResult = await sessionService.execute({
			userId: user.id.toString(),
			sessionToken: token,
		});

		if (sessionResult.isFalse()) {
			return reply.status(401).send({ message: 'Erro ao tentar realizar autenticação.' });
		}

		return reply
			.setCookie(env.COOKIE_NAME, token, {
				path: '/',
				maxAge: 7 * 86400, // 7 days in seconds
				httpOnly: true,
				secure: env.NODE_ENV === 'production',
				// sameSite: 'none',
			})
			.status(200)
			.send({
				token,
				user: UserPresenter.toHTTP(user),
			});
	} catch (error) {
		console.log('authenticateUserController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar se autenticar.' });
	}
}

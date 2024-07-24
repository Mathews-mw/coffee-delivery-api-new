import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/infra/env';
import { RegisterUserSessionUseCase } from '@/domains/main/application/modules/auth/register-user-session-use-case';

export async function userRefreshTokenController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	await request.jwtVerify({ onlyCookie: true });

	const { sub, role } = request.user;

	const sessionService = container.resolve(RegisterUserSessionUseCase);

	const token = await reply.jwtSign({ role }, { sign: { sub } });

	const refreshToken = await reply.jwtSign({
		sign: {
			sub,
			expiresIn: '7d',
			role,
		},
	});

	await sessionService.execute({
		userId: sub,
		sessionToken: refreshToken,
	});

	return reply
		.setCookie(env.COOKIE_NAME, refreshToken, {
			path: '/',
			maxAge: 7 * 86400, // 7 days in seconds
			httpOnly: true,
			// sameSite: 'none',
		})
		.status(200)
		.send({ token });
}

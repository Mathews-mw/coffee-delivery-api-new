import { UserRoleType } from '@/domains/main/resources/entities/user';
import { VerifyPayloadType } from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

interface IPayload {
	sign: {
		sub: string;
		role: UserRoleType;
		expiresIn: string;
	};
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
	try {
		const verifyResult: VerifyPayloadType = await request.jwtVerify({ onlyCookie: true });

		const { sign } = verifyResult as IPayload;

		request.user = {
			sub: sign.sub,
			role: sign.role,
		};

		return verifyResult;
	} catch (error) {
		return reply.status(401).send({ message: 'Sem autorização por autenticação' });
	}
}

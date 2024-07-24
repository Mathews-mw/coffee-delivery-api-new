import { FastifyReply, FastifyRequest } from 'fastify';

import { UserRoleType } from '@/domains/main/resources/entities/user';

export function verifyUserRoleMiddleware(roleToVerify: UserRoleType) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { role } = request.user;

		if (role !== roleToVerify) {
			return reply.status(401).send({ message: 'Sem permissões para realizar está operação.' });
		}
	};
}

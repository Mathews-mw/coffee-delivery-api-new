import { Session as PrismaSession } from '@prisma/client';
import { Session } from '@/domains/main/resources/entities/session';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class PrismaSessionMapper {
	static toDomain(raw: PrismaSession): Session {
		return Session.create(
			{
				userId: new UniqueEntityId(raw.userId),
				sessionToken: raw.sessionToken,
				expiresAt: raw.expiresAt,
				registerAt: raw.registerAt,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(session: Session): PrismaSession {
		return {
			id: session.id.toString(),
			userId: session.userId.toString(),
			sessionToken: session.sessionToken,
			expiresAt: session.expiresAt,
			registerAt: session.registerAt,
		};
	}
}

import { prisma } from '../prisma';
import { Session } from '@/domains/main/resources/entities/session';
import { PrismaSessionMapper } from './mappers/prisma-session-mapper';
import { ISessionRepository } from '@/domains/main/application/modules/accounts/repositories/ISessionRepository';

export class PrismaSessionsRepository implements ISessionRepository {
	async create(session: Session): Promise<Session> {
		const data = PrismaSessionMapper.toPrisma(session);

		await prisma.session.create({
			data,
		});

		return session;
	}

	async update(session: Session): Promise<Session> {
		const data = PrismaSessionMapper.toPrisma(session);

		await prisma.session.update({
			data,
			where: {
				id: data.id,
			},
		});

		return session;
	}

	async delete(session: Session): Promise<void> {
		await prisma.session.delete({
			where: {
				id: session.id.toString(),
			},
		});
	}

	async findById(id: string): Promise<Session | null> {
		const session = await prisma.session.findUnique({
			where: {
				id,
			},
		});

		if (!session) {
			return null;
		}

		return PrismaSessionMapper.toDomain(session);
	}

	async findByUserId(userId: string): Promise<Session | null> {
		const session = await prisma.session.findUnique({
			where: {
				userId,
			},
		});

		if (!session) {
			return null;
		}

		return PrismaSessionMapper.toDomain(session);
	}
}

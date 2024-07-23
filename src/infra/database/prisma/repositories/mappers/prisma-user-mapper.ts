import { User as PrismaUser } from '@prisma/client';
import { User } from '@/domains/main/resources/entities/user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class PrismaUserMapper {
	static toDomain(raw: PrismaUser): User {
		return User.create(
			{
				name: raw.name,
				email: raw.email,
				password: raw.password,
				role: raw.role,
				isActive: raw.isActive,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(user: User): PrismaUser {
		return {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			password: user.password ?? null,
			role: user.role,
			isActive: user.isActive,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt ?? null,
		};
	}
}

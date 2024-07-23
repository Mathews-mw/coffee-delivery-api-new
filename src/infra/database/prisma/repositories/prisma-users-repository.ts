import { Prisma } from '@prisma/client';

import { prisma } from '../prisma';
import { User } from '@/domains/main/resources/entities/user';
import { PrismaUserMapper } from './mappers/prisma-user-mapper';
import { IUserQuerySearch, IUserRepository, IUserResponse } from '@/domains/main/application/modules/accounts/repositories/IUserRepository';

export class PrismaUsersRepository implements IUserRepository {
	async create(user: User): Promise<User> {
		const data = PrismaUserMapper.toPrisma(user);

		await prisma.user.create({
			data,
		});

		return user;
	}

	async update(user: User): Promise<User> {
		const data = PrismaUserMapper.toPrisma(user);

		await prisma.user.update({
			data,
			where: {
				id: data.id,
			},
		});

		return user;
	}

	async delete(user: User): Promise<void> {
		await prisma.user.delete({
			where: {
				id: user.id.toString(),
			},
		});
	}

	async findAll({ page, perPage, search }: IUserQuerySearch): Promise<IUserResponse> {
		const query: Prisma.UserFindManyArgs = {
			where: {
				name: {
					contains: search,
					mode: 'insensitive',
				},
				email: {
					contains: search,
					mode: 'insensitive',
				},
			},
		};

		const [prismaUsers, count] = await prisma.$transaction([
			prisma.user.findMany({
				where: query.where,
			}),
			prisma.user.count({
				where: query.where,
			}),
		]);

		const totalPages = Math.ceil(count / perPage);

		const pagination = {
			page,
			perPage,
			totalPages,
			totalOccurrences: count,
		};

		const users = prismaUsers.map(PrismaUserMapper.toDomain);

		return {
			users,
			pagination,
		};
	}

	async findById(id: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) {
			return null;
		}

		return PrismaUserMapper.toDomain(user);
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return null;
		}

		return PrismaUserMapper.toDomain(user);
	}
}

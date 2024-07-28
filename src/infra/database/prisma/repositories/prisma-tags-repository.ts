import { prisma } from '../prisma';
import { Tag } from '@/domains/main/resources/entities/tag';
import { PrismaTagMapper } from './mappers/prisma-tag-mapper';
import { IQuerySearch, ITagRepository } from '@/domains/main/application/modules/tag/repositories/ITagRepository';

export class PrismaTagsRepository implements ITagRepository {
	async create(tag: Tag): Promise<Tag> {
		const data = PrismaTagMapper.toPrisma(tag);

		await prisma.tag.create({
			data,
		});

		return tag;
	}

	async update(tag: Tag): Promise<Tag> {
		const data = PrismaTagMapper.toPrisma(tag);

		await prisma.tag.update({
			data,
			where: {
				id: data.id,
			},
		});

		return tag;
	}

	async delete(tag: Tag): Promise<void> {
		await prisma.tag.delete({
			where: {
				id: tag.id.toString(),
			},
		});
	}

	async findAll({ search }: IQuerySearch): Promise<Tag[]> {
		const tags = await prisma.tag.findMany({
			where: {
				tagName: search,
			},
		});

		return tags.map(PrismaTagMapper.toDomain);
	}

	async findById(id: string): Promise<Tag | null> {
		const tag = await prisma.tag.findUnique({
			where: {
				id,
			},
		});

		if (!tag) {
			return null;
		}

		return PrismaTagMapper.toDomain(tag);
	}

	async findByTagName(tagName: string): Promise<Tag | null> {
		const tag = await prisma.tag.findUnique({
			where: {
				tagName,
			},
		});

		if (!tag) {
			return null;
		}

		return PrismaTagMapper.toDomain(tag);
	}
}

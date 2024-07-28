import { Tag as PrismaTag } from '@prisma/client';
import { Tag } from '@/domains/main/resources/entities/tag';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class PrismaTagMapper {
	static toDomain(raw: PrismaTag): Tag {
		return Tag.create(
			{
				tagName: raw.tagName,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(tag: Tag): PrismaTag {
		return {
			id: tag.id.toString(),
			tagName: tag.tagName,
		};
	}
}

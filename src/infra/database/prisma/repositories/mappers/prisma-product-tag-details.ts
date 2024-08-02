import { Tag as PrismaTag, ProductTag as PrismaProductTag } from '@prisma/client';

import { PrismaTagMapper } from './prisma-tag-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductTagDetails } from '@/domains/main/resources/entities/value-objects/product-tag-details';

type PrismaProductTagDetails = PrismaProductTag & {
	tag: PrismaTag;
};

export class PrismaProductTagDetailsMapper {
	static toDomain(raw: PrismaProductTagDetails): ProductTagDetails {
		return ProductTagDetails.create({
			tagId: new UniqueEntityId(raw.tagId),
			productId: new UniqueEntityId(raw.productId),
			tag: PrismaTagMapper.toDomain(raw.tag),
		});
	}
}

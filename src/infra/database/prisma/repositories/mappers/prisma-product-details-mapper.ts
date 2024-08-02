import { Product as PrismaProduct, Tag as PrismaTag, ProductTag as PrismaProductTag } from '@prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaProductTagDetailsMapper } from './prisma-product-tag-details';
import { ProductDetails } from '@/domains/main/resources/entities/value-objects/product-details';

type PrismaProductTagDetails = PrismaProductTag & {
	tag: PrismaTag;
};

type PrismaProductDetails = PrismaProduct & {
	productsTags: PrismaProductTagDetails[];
};

export class PrismaProductDetailsMapper {
	static toDomain(raw: PrismaProductDetails): ProductDetails {
		return ProductDetails.create({
			id: new UniqueEntityId(raw.id),
			name: raw.name,
			price: raw.price,
			description: raw.description,
			available: raw.available,
			imageUrl: raw.imageUrl ?? '',
			tags: raw.productsTags.map(PrismaProductTagDetailsMapper.toDomain),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		});
	}
}

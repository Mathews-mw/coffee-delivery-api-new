import { Prisma, ProductTag as PrismaProductTag } from '@prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';

export class PrismaProductTagMapper {
	static toDomain(raw: PrismaProductTag): ProductTag {
		return ProductTag.create({
			tagId: new UniqueEntityId(raw.tagId),
			productId: new UniqueEntityId(raw.productId),
		});
	}

	static toPrisma(productTag: ProductTag): PrismaProductTag {
		return {
			tagId: productTag.tagId.toString(),
			productId: productTag.productId.toString(),
		};
	}

	static toPrismaUpdateMany(productsTags: ProductTag[]): Prisma.ProductTagUpdateManyArgs {
		const tagsIds = productsTags.map((item) => item.tagId.toString());

		return {
			data: {
				productId: productsTags[0].productId.toString(),
			},
			where: {
				tagId: {
					in: tagsIds,
				},
			},
		};
	}
}

import { Prisma, Product as PrismaProduct } from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Product } from '@/domains/main/resources/entities/product';

export class PrismaProductMapper {
	static toDomain(raw: PrismaProduct): Product {
		return Product.create(
			{
				name: raw.name,
				price: raw.price,
				description: raw.description,
				available: raw.available,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
		return {
			id: product.id.toString(),
			name: product.name,
			price: product.price,
			description: product.description,
			available: product.available,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt ?? null,
		};
	}
}

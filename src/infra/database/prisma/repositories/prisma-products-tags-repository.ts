import { prisma } from '../prisma';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { PrismaProductTagMapper } from './mappers/prisma-product-tag-mapper';
import { IProductTagRepository } from '@/domains/main/application/modules/tag/repositories/IProductTagRepository';

export class PrismaProductsTagsRepository implements IProductTagRepository {
	async createMany(productTags: ProductTag[]): Promise<void> {
		if (productTags.length === 0) {
			return;
		}

		const data = productTags.map(PrismaProductTagMapper.toPrisma);

		await prisma.productTag.createMany({
			data,
		});
	}

	async deleteMany(productsTags: ProductTag[]): Promise<void> {
		if (productsTags.length === 0) {
			return;
		}

		for (const productTag of productsTags) {
			await prisma.productTag.delete({
				where: {
					tagId_productId: { tagId: productTag.tagId.toString(), productId: productTag.productId.toString() },
				},
			});
		}
	}

	async deleteManyByProductId(productId: string): Promise<void> {
		await prisma.productTag.deleteMany({
			where: {
				productId,
			},
		});
	}

	async findById(id: string): Promise<ProductTag | null> {
		throw new Error('Method not implemented.');
	}

	async findManyByTagId(tagId: string): Promise<ProductTag[]> {
		const productsTags = await prisma.productTag.findMany({
			where: {
				tagId,
			},
		});

		return productsTags.map(PrismaProductTagMapper.toDomain);
	}

	async findManyByProductId(productId: string): Promise<ProductTag[]> {
		const productsTags = await prisma.productTag.findMany({
			where: {
				productId,
			},
		});

		return productsTags.map(PrismaProductTagMapper.toDomain);
	}
}

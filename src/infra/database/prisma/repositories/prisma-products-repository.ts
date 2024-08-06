import { Prisma } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { prisma } from '../prisma';
import containerKeysConfig from '@/config/container-keys.config';
import { Product } from '@/domains/main/resources/entities/product';
import { PrismaProductMapper } from './mappers/prisma-product-mapper';
import { PrismaProductDetailsMapper } from './mappers/prisma-product-details-mapper';
import { ProductDetails } from '@/domains/main/resources/entities/value-objects/product-details';
import { IProductTagRepository } from '@/domains/main/application/modules/tag/repositories/IProductTagRepository';
import { IProductAttachmentRepository } from '@/domains/main/application/modules/products/repositories/IProductAttachmentRepository';
import { IProductRepository, IProductResponse, IQuerySearch } from '@/domains/main/application/modules/products/repositories/IProductRepository';

@injectable()
export class PrismaProductsRepository implements IProductRepository {
	constructor(
		@inject(containerKeysConfig.repositories.products_tags_repository) private productsTagsRepository: IProductTagRepository,
		@inject(containerKeysConfig.repositories.products_attachments_repository) private productsAttachmentsRepository: IProductAttachmentRepository
	) {}

	async create(product: Product): Promise<Product> {
		const data = PrismaProductMapper.toPrisma(product);

		await prisma.product.create({
			data,
		});

		await this.productsTagsRepository.createMany(product.tags.getItems());
		await this.productsAttachmentsRepository.create(product.image.getItems()[0]);

		return product;
	}

	async update(product: Product): Promise<Product> {
		const data = PrismaProductMapper.toPrisma(product);

		await prisma.product.update({
			data,
			where: {
				id: data.id,
			},
		});

		const toCreateNewAttachments = product.image.getNewItems();
		const toDeleteAttachments = product.image.getItems();

		if (toCreateNewAttachments.length > 0) {
			await this.productsAttachmentsRepository.create(product.image.getNewItems()[0]);
		}

		if (toDeleteAttachments.length > 0) {
			await this.productsAttachmentsRepository.delete(toDeleteAttachments[0]);
		}

		await this.productsTagsRepository.createMany(product.tags.getNewItems());
		await this.productsTagsRepository.deleteMany(product.tags.getRemovedItems());

		return product;
	}

	async delete(product: Product): Promise<void> {
		await prisma.product.delete({
			where: {
				id: product.id.toString(),
			},
		});

		await this.productsTagsRepository.deleteManyByProductId(product.id.toString());
		await this.productsAttachmentsRepository.deleteByProductId(product.id.toString());
	}

	async findAll({ page, perPage, search, available }: IQuerySearch): Promise<IProductResponse> {
		const query: Prisma.ProductFindManyArgs = {
			where: {
				name: {
					contains: search,
					mode: 'insensitive',
				},
				available,
			},
		};

		const [prismaProducts, count] = await prisma.$transaction([
			prisma.product.findMany({
				where: query.where,
				include: {
					productsTags: {
						include: {
							tag: true,
						},
					},
				},
				orderBy: {
					name: 'asc',
				},
				take: perPage,
				skip: (page - 1) * perPage,
			}),
			prisma.product.count({
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

		const products = prismaProducts.map(PrismaProductDetailsMapper.toDomain);

		return {
			pagination,
			products,
		};
	}

	async findById(id: string): Promise<Product | null> {
		const product = await prisma.product.findUnique({
			where: {
				id,
			},
		});

		if (!product) {
			return null;
		}

		return PrismaProductMapper.toDomain(product);
	}

	async findByName(productName: string): Promise<Product | null> {
		const product = await prisma.product.findUnique({
			where: {
				name: productName,
			},
		});

		if (!product) {
			return null;
		}

		return PrismaProductMapper.toDomain(product);
	}

	async findProductDetail(id: string): Promise<ProductDetails | null> {
		const product = await prisma.product.findUnique({
			where: {
				id,
			},
			include: {
				productsTags: {
					include: {
						tag: true,
					},
				},
			},
		});

		if (!product) {
			return null;
		}

		return PrismaProductDetailsMapper.toDomain(product);
	}
}

import { Product } from '@/domains/main/resources/entities/product';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryProductsTagsRepository } from './in-memory-products-tags-repository';
import { InMemoryProductAttachmentRepository } from './in-memory-product-attachments-repository';
import { IProductRepository, IProductResponse, IQuerySearch } from '@/domains/main/application/modules/products/repositories/IProductRepository';

export class InMemoryProductsRepository implements IProductRepository {
	public items: Product[] = [];

	constructor(
		private productsTagsRepository: InMemoryProductsTagsRepository,
		private attachmentRepository: InMemoryAttachmentsRepository,
		private productAttachmentsRepository: InMemoryProductAttachmentRepository
	) {}

	async create(product: Product): Promise<Product> {
		this.items.push(product);

		await this.productsTagsRepository.createMany(product.tags.getItems());

		const attachment = await product.image.getItems();
		await this.productAttachmentsRepository.create(attachment[0]);

		return product;
	}

	async update(product: Product): Promise<Product> {
		const productIndex = this.items.findIndex((item) => item.id === product.id);

		this.items[productIndex] = product;

		await this.productsTagsRepository.createMany(product.tags.getNewItems());
		await this.productsTagsRepository.deleteMany(product.tags.getRemovedItems());

		await this.productAttachmentsRepository.create(product.image.getNewItems()[0]);
		await this.productAttachmentsRepository.delete(product.image.getRemovedItems()[0]);

		return product;
	}

	async delete(product: Product): Promise<void> {
		const productIndex = this.items.findIndex((item) => item.id === product.id);

		this.items.slice(productIndex, 1);

		await this.productsTagsRepository.deleteManyByProductId(product.id.toString());

		await this.productAttachmentsRepository.deleteByProductId(product.id.toString());
	}

	async findAll({ search, page, perPage }: IQuerySearch): Promise<IProductResponse> {
		const productsPaginated = this.items
			.filter((item) => (search ? item.name.toLowerCase().includes(search.toLocaleLowerCase()) : item))
			.slice((page - 1) * perPage, page * perPage);

		const totalOccurrences = productsPaginated.length;
		const totalPages = Math.ceil(totalOccurrences / perPage);

		const pagination = {
			page,
			perPage,
			totalPages,
			totalOccurrences,
		};

		return {
			pagination,
			products: productsPaginated,
		};
	}

	async findById(id: string): Promise<Product | null> {
		const product = this.items.find((item) => item.id.toString() === id);

		if (!product) {
			return null;
		}

		return product;
	}

	async findByName(productName: string): Promise<Product | null> {
		const product = this.items.find((item) => item.name.toLowerCase() === productName.toLowerCase());

		if (!product) {
			return null;
		}

		return product;
	}
}

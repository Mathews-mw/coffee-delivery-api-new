import { IProductRepository, IProductResponse, IQuerySearch } from '@/domains/main/application/modules/products/repositories/IProductRepository';
import { Product } from '@/domains/main/resources/entities/product';
import { InMemoryProductsTagsRepository } from './in-memory-products-tags-repository';

export class InMemoryProductsRepository implements IProductRepository {
	public items: Product[] = [];

	constructor(private productsTagsRepository: InMemoryProductsTagsRepository) {}

	async create(product: Product): Promise<Product> {
		this.items.push(product);

		await this.productsTagsRepository.createMany(product.tags.getItems());

		return product;
	}

	async update(product: Product): Promise<Product> {
		const productIndex = this.items.findIndex((item) => item.id === product.id);

		this.items[productIndex] = product;

		await this.productsTagsRepository.createMany(product.tags.getNewItems());
		await this.productsTagsRepository.deleteMany(product.tags.getRemovedItems());

		return product;
	}

	async delete(product: Product): Promise<void> {
		const productIndex = this.items.findIndex((item) => item.id === product.id);

		this.items.slice(productIndex, 1);

		await this.productsTagsRepository.deleteManyByProductId(product.id.toString());
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

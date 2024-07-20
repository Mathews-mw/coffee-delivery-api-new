import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { IProductTagRepository } from '@/domains/main/application/modules/products-tags/repositories/product-tag-repository';

export class InMemoryProductsTagsRepository implements IProductTagRepository {
	public items: ProductTag[] = [];

	async createMany(productTags: ProductTag[]): Promise<void> {
		this.items.push(...productTags);
	}

	async deleteMany(productTags: ProductTag[]): Promise<void> {
		const productsTags = this.items.filter((item) => {
			return !productTags.some((productTag) => productTag.equals(item));
		});

		this.items = productsTags;
	}

	async deleteManyByProductId(productId: string): Promise<void> {
		const productsTags = this.items.filter((item) => item.productId.toString() !== productId);

		this.items = productsTags;
	}

	async findById(id: string): Promise<ProductTag | null> {
		const productTag = this.items.find((item) => item.id.toString() === id);

		if (!productTag) {
			return null;
		}

		return productTag;
	}

	async findManyByTagId(tagId: string): Promise<ProductTag[]> {
		return this.items.filter((item) => item.tagId.toString() === tagId);
	}

	async findManyByProductId(productId: string): Promise<ProductTag[]> {
		return this.items.filter((item) => item.productId.toString() === productId);
	}
}

import { Tag } from '@/domains/main/resources/entities/tag';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';

export interface ICreateTagProductRequest {
	productId: string;
	tagsId: Array<string>;
}

export interface IUpdateTagProductRequest {
	productId: string;
	tags: Tag[];
}

export interface IProductTagRepository {
	createMany(productTags: ProductTag[]): Promise<void>;
	deleteMany(productTags: ProductTag[]): Promise<void>;
	deleteManyByProductId(productId: string): Promise<void>;
	findById(id: string): Promise<ProductTag | null>;
	findManyByTagId(tagId: string): Promise<ProductTag[]>;
	findManyByProductId(productId: string): Promise<ProductTag[]>;
}

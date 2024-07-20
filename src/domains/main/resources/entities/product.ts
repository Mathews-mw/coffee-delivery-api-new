import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductTagList } from './product-tag-list';

export interface IProductsProps {
	name: string;
	price: number;
	description: string;
	imageUrl: string;
	available: boolean;
	tags: ProductTagList;
	createdAt: Date;
	updatedAt?: Date;
}

export class Product extends Entity<IProductsProps> {
	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
		this.touch();
	}

	get price() {
		return this.props.price;
	}

	set price(price: number) {
		this.props.price = price;
		this.touch();
	}

	get description() {
		return this.props.description;
	}

	set description(description: string) {
		this.props.description = description;
		this.touch();
	}

	get imageUrl() {
		return this.props.imageUrl;
	}

	set imageUrl(imageUrl: string) {
		this.props.imageUrl = imageUrl;
		this.touch();
	}

	get available() {
		return this.props.available;
	}

	set available(available: boolean) {
		this.props.available = available;
		this.touch();
	}

	get tags() {
		return this.props.tags;
	}

	set tags(tags: ProductTagList) {
		this.props.tags = tags;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IProductsProps, 'available' | 'tags' | 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const product = new Product(
			{
				available: props.available ?? true,
				tags: props.tags ?? new ProductTagList(),
				createdAt: new Date(),
				...props,
			},
			id
		);

		return product;
	}
}

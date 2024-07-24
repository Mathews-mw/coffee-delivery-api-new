import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { ProductTagList } from './product-tag-list';
import { ProductAttachmentList } from './product-attachment-list';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductProps {
	name: string;
	price: number;
	description: string;
	available: boolean;
	tags: ProductTagList;
	image: ProductAttachmentList;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Product extends Entity<IProductProps> {
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

	get image() {
		return this.props.image;
	}

	set image(image: ProductAttachmentList) {
		this.props.image = image;
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

	static create(props: Optional<IProductProps, 'available' | 'tags' | 'image' | 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const product = new Product(
			{
				available: props.available ?? true,
				tags: props.tags ?? new ProductTagList(),
				image: props.image ?? new ProductAttachmentList(),
				createdAt: new Date(),
				...props,
			},
			id
		);

		return product;
	}
}

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductsProps {
	name: string;
	price: number;
	description: string;
	available: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

export class Product extends Entity<IProductsProps> {
	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.name = name;
		this.touch();
	}

	get price() {
		return this.props.price;
	}

	set price(price: number) {
		this.price = price;
		this.touch();
	}

	get description() {
		return this.props.description;
	}

	set description(description: string) {
		this.description = description;
		this.touch();
	}

	get available() {
		return this.props.available;
	}

	set available(available: boolean) {
		this.available = available;
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

	static create(props: Optional<IProductsProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const product = new Product(
			{
				createdAt: new Date(),
				...props,
			},
			id
		);

		return product;
	}
}

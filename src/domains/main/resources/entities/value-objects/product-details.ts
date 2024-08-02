import { ProductTagDetails } from './product-tag-details';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductDetailsProps {
	id: UniqueEntityId;
	name: string;
	price: number;
	description: string;
	available: boolean;
	tags: ProductTagDetails[];
	imageUrl: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class ProductDetails extends ValueObject<IProductDetailsProps> {
	get id() {
		return this.props.id;
	}

	get name() {
		return this.props.name;
	}

	get price() {
		return this.props.price;
	}

	get description() {
		return this.props.description;
	}

	get available() {
		return this.props.available;
	}

	get tags() {
		return this.props.tags;
	}

	get imageUrl() {
		return this.props.imageUrl;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(props: IProductDetailsProps) {
		return new ProductDetails(props);
	}
}

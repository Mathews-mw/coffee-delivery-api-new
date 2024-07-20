import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductTagProps {
	tagId: UniqueEntityId;
	productId: UniqueEntityId;
}

export class ProductTag extends Entity<IProductTagProps> {
	get tagId() {
		return this.props.tagId;
	}

	get productId() {
		return this.props.productId;
	}

	static create(props: IProductTagProps, id?: UniqueEntityId) {
		const productTag = new ProductTag(props, id);

		return productTag;
	}
}

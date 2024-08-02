import { Tag } from '../tag';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductTagDetailsProps {
	tagId: UniqueEntityId;
	productId: UniqueEntityId;
	tag: Tag;
}

export class ProductTagDetails extends ValueObject<IProductTagDetailsProps> {
	get tagId() {
		return this.props.tagId;
	}

	get productId() {
		return this.props.productId;
	}

	get tag() {
		return this.props.tag;
	}

	static create(props: IProductTagDetailsProps) {
		return new ProductTagDetails(props);
	}
}

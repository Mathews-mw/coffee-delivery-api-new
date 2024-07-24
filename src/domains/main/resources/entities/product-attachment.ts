import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductAttachmentProps {
	attachmentId: UniqueEntityId;
	productId: UniqueEntityId;
}

export class ProductAttachment extends Entity<IProductAttachmentProps> {
	get attachmentId() {
		return this.props.attachmentId;
	}

	get productId() {
		return this.props.productId;
	}

	static create(props: IProductAttachmentProps, id?: UniqueEntityId) {
		const productAttachment = new ProductAttachment(props, id);

		return productAttachment;
	}
}

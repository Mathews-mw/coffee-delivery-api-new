import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IProductAttachmentProps, ProductAttachment } from '@/domains/main/resources/entities/product-attachment';

export function makeProductAttachment(override: Partial<IProductAttachmentProps> = {}, id?: UniqueEntityId) {
	const productAttachment = ProductAttachment.create(
		{
			attachmentId: new UniqueEntityId(),
			productId: new UniqueEntityId(),
			...override,
		},
		id
	);

	return productAttachment;
}

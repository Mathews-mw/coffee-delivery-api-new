import { Attachment as PrismaAttachment, Product as PrismaProduct } from '@prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductAttachment } from '@/domains/main/resources/entities/product-attachment';

export class PrismaProductAttachmentMapper {
	static toDomain(raw: PrismaAttachment): ProductAttachment {
		if (!raw.productId) {
			throw new Error('Invalid attachment type.');
		}

		return ProductAttachment.create(
			{
				attachmentId: new UniqueEntityId(raw.id),
				productId: new UniqueEntityId(raw.productId),
			},
			new UniqueEntityId(raw.id)
		);
	}
}

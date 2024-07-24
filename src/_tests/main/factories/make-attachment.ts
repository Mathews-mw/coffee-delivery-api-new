import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Attachment, IAttachmentProps } from '@/domains/main/resources/entities/attachment';

export function makeAttachment(override: Partial<IAttachmentProps> = {}, id?: UniqueEntityId) {
	const attachment = Attachment.create(
		{
			fileName: faker.lorem.slug(),
			url: faker.internet.url(),
			...override,
		},
		id
	);

	return attachment;
}

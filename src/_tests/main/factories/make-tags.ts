import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ITagProps, Tag } from '@/domains/main/resources/entities/tag';

export function makeTag(override: Partial<ITagProps> = {}, id?: UniqueEntityId) {
	const tag = Tag.create(
		{
			tagName: faker.commerce.productAdjective(),
			...override,
		},
		id
	);

	return tag;
}

import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IProductsProps, Product } from '@/domains/main/resources/entities/product';

export function makeProduct(override: Partial<IProductsProps> = {}, id?: UniqueEntityId) {
	const product = Product.create(
		{
			name: faker.commerce.productName(),
			price: faker.number.float({ min: 8, max: 25, multipleOf: 0.2 }),
			description: faker.commerce.productDescription(),
			...override,
		},
		id
	);

	return product;
}

import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IOrderProps, Order } from '@/domains/main/resources/entities/order';

export function makeOrder(override: Partial<IOrderProps> = {}, id?: UniqueEntityId) {
	const order = Order.create(
		{
			customerId: new UniqueEntityId(randomUUID()),
			phoneNumber: faker.phone.number(),
			cpf: faker.number.int({ min: 11, max: 11 }).toString(),
			street: faker.location.street(),
			number: faker.location.buildingNumber(),
			complement: faker.lorem.words(5),
			district: faker.lorem.word(),
			city: faker.location.city(),
			estate: faker.location.state(),
			cep: faker.location.zipCode(),
			paymentType: 'DEBIT',
			totalCost: faker.number.float({ min: 10, max: 50 }),
			status: 'PROCESSING',
			...override,
		},
		id
	);

	return order;
}

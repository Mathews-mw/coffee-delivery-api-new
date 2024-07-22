import { randomUUID } from 'node:crypto';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ICustomerProps, Customer } from '@/domains/main/resources/entities/customer';

export function makeCustomer(override: Partial<ICustomerProps> = {}, id?: UniqueEntityId) {
	const customer = Customer.create(
		{
			userId: new UniqueEntityId(randomUUID()),
			registrationId: new UniqueEntityId(randomUUID()),
			...override,
		},
		id
	);

	return customer;
}

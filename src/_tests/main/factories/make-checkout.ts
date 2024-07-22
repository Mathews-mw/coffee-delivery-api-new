import { randomUUID } from 'node:crypto';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ICheckoutProps, Checkout } from '@/domains/main/resources/entities/checkout';

export function makeCheckout(override: Partial<ICheckoutProps> = {}, id?: UniqueEntityId) {
	const checkout = Checkout.create(
		{
			customerId: new UniqueEntityId(randomUUID()),
			productId: new UniqueEntityId(randomUUID()),
			orderId: new UniqueEntityId(randomUUID()),
			status: 'ACTIVE',
			...override,
		},
		id
	);

	return checkout;
}

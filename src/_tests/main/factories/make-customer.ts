import { makeUser } from './make-user';
import { makeRegistration } from './make-registration';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ICustomerProps, Customer } from '@/domains/main/resources/entities/customer';

export function makeCustomer(override: Partial<ICustomerProps> = {}, id?: UniqueEntityId) {
	const user = makeUser();
	const registration = makeRegistration();

	const customer = Customer.create(
		{
			userId: user.id,
			registrationId: registration.id,
			...override,
		},
		id
	);

	return customer;
}

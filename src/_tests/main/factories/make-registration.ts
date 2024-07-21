import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IRegistrationProps, Registration } from '@/domains/main/resources/entities/registration';

export function makeRegistration(override: Partial<IRegistrationProps> = {}, id?: UniqueEntityId) {
	const registration = Registration.create(
		{
			phoneNumber: faker.phone.number(),
			cpf: faker.number.int({ min: 11, max: 11 }).toString(),
			street: faker.location.street(),
			number: faker.location.buildingNumber(),
			complement: faker.lorem.words(5),
			district: faker.lorem.word(),
			city: faker.location.city(),
			estate: faker.location.state(),
			cep: faker.location.zipCode(),
			...override,
		},
		id
	);

	return registration;
}

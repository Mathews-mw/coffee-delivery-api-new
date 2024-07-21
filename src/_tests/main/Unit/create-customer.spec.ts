import { InMemoryUsersRepository } from '../in-memory/in-memory-users-repository';
import { InMemoryCustomersRepository } from '../in-memory/in-memory-customers-repository';
import { InMemoryRegistrationsRepository } from '../in-memory/in-memory-registrations-repository';
import { CreateCustomerUseCase } from '@/domains/main/application/modules/accounts/use-cases/create-customer-use-case';
import { makeUser } from '../factories/make-user';

let usersRepository: InMemoryUsersRepository;
let createCustomerUseCase: CreateCustomerUseCase;
let customerRepository: InMemoryCustomersRepository;
let registrationsRepository: InMemoryRegistrationsRepository;

describe('Create Customer Use Case', () => {
	beforeAll(() => {
		usersRepository = new InMemoryUsersRepository();
		customerRepository = new InMemoryCustomersRepository();
		registrationsRepository = new InMemoryRegistrationsRepository();
		createCustomerUseCase = new CreateCustomerUseCase(usersRepository, customerRepository, registrationsRepository);
	});

	test('Should be able to create a customer', async () => {
		const user = makeUser();
		usersRepository.items.push(user);

		const result = await createCustomerUseCase.execute({
			userId: user.id.toString(),
			phoneNumber: '99988887777',
			cpf: '09988877755',
			street: 'Rua Barcelos',
			number: '324',
			complement: 'Res Atlanta, Apt 304',
			district: 'Parque Orlando',
			city: 'Constantinopolis',
			estate: 'Brasilandia',
			cep: '69000000',
		});

		expect(result.isSuccess()).toBe(true);
		expect(customerRepository.items).toHaveLength(1);
		expect(result.value).toEqual({
			registration: registrationsRepository.items[0],
		});
	});
});

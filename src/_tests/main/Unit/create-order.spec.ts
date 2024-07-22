import { makeUser } from '../factories/make-user';
import { makeCustomer } from '../factories/make-customer';
import { makeCheckout } from '../factories/make-checkout';
import { makeRegistration } from '../factories/make-registration';
import { InMemoryUsersRepository } from '../in-memory/in-memory-users-repository';
import { InMemoryOrderRepository } from '../in-memory/in-memory-orders-repository';
import { InMemoryCheckoutsRepository } from '../in-memory/in-memory-checkouts-repository';
import { InMemoryCustomersRepository } from '../in-memory/in-memory-customers-repository';
import { InMemoryRegistrationsRepository } from '../in-memory/in-memory-registrations-repository';
import { CreateOrderUseCase } from '@/domains/main/application/modules/orders/use-cases/create-order';

let createOrderUseCase: CreateOrderUseCase;
let usersRepository: InMemoryUsersRepository;
let ordersRepository: InMemoryOrderRepository;
let checkoutRepository: InMemoryCheckoutsRepository;
let customersRepository: InMemoryCustomersRepository;
let registrationRepository: InMemoryRegistrationsRepository;

describe('Create Order Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		ordersRepository = new InMemoryOrderRepository();
		checkoutRepository = new InMemoryCheckoutsRepository();
		registrationRepository = new InMemoryRegistrationsRepository();
		customersRepository = new InMemoryCustomersRepository(usersRepository, registrationRepository);
		createOrderUseCase = new CreateOrderUseCase(ordersRepository, checkoutRepository, customersRepository);
	});

	it('Should be possible to create the order and set the status of the related checkouts as paid', async () => {
		const user = makeUser();
		const registration = makeRegistration();
		const customer = makeCustomer({
			userId: user.id,
			registrationId: registration.id,
		});

		usersRepository.items.push(user);
		registrationRepository.items.push(registration);
		customersRepository.items.push(customer);

		const checkout1 = makeCheckout({ orderId: undefined, customerId: customer.id });
		const checkout2 = makeCheckout({ orderId: undefined, customerId: customer.id });

		checkoutRepository.items.push(checkout1);
		checkoutRepository.items.push(checkout2);

		const result = await createOrderUseCase.execute({
			customerId: customer.id.toString(),
			phoneNumber: '92988887777',
			cpf: '09988877755',
			street: 'Vijeb Mill',
			number: '649',
			complement: 'Apt 8A',
			district: 'MonopollyTown',
			city: 'Mihnuul',
			estate: 'Monopolly',
			cep: '69000000',
			paymentType: 'DEBIT',
			totalCost: 32.2,
		});

		if (result.isFalse()) {
			throw Error('Create Order Error Test');
		}

		expect(result.isSuccess()).toBe(true);
		expect(ordersRepository.items).toHaveLength(1);
		expect(result.value).toEqual({
			order: ordersRepository.items[0],
		});
		expect(checkoutRepository.items[0]).toEqual(
			expect.objectContaining({
				status: 'PAID',
				orderId: result.value.order.id,
			})
		);
	});
});

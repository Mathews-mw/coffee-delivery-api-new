import { makeUser } from '../factories/make-user';
import { makeProduct } from '../factories/make-product';
import { makeCustomer } from '../factories/make-customer';
import { makeRegistration } from '../factories/make-registration';
import { InMemoryUsersRepository } from '../in-memory/in-memory-users-repository';
import { InMemoryProductsRepository } from '../in-memory/in-memory-products-repository';
import { InMemoryCustomersRepository } from '../in-memory/in-memory-customers-repository';
import { InMemoryCheckoutsRepository } from '../in-memory/in-memory-checkouts-repository';
import { InMemoryAttachmentsRepository } from '../in-memory/in-memory-attachments-repository';
import { InMemoryProductsTagsRepository } from '../in-memory/in-memory-products-tags-repository';
import { InMemoryRegistrationsRepository } from '../in-memory/in-memory-registrations-repository';
import { CreateCheckoutUseCase } from '@/domains/main/application/modules/orders/use-cases/create-checkout';
import { InMemoryProductAttachmentRepository } from '../in-memory/in-memory-product-attachments-repository';

let usersRepository: InMemoryUsersRepository;
let createCheckoutUseCase: CreateCheckoutUseCase;
let productsRepository: InMemoryProductsRepository;
let checkoutsRepository: InMemoryCheckoutsRepository;
let customersRepository: InMemoryCustomersRepository;
let attachmentRepository: InMemoryAttachmentsRepository;
let productsTagsRepository: InMemoryProductsTagsRepository;
let registrationRepository: InMemoryRegistrationsRepository;
let productAttachmentsRepository: InMemoryProductAttachmentRepository;

describe('Create Checkout Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		checkoutsRepository = new InMemoryCheckoutsRepository();
		productsTagsRepository = new InMemoryProductsTagsRepository();
		registrationRepository = new InMemoryRegistrationsRepository();
		attachmentRepository = new InMemoryAttachmentsRepository();
		productAttachmentsRepository = new InMemoryProductAttachmentRepository();
		productsRepository = new InMemoryProductsRepository(productsTagsRepository, attachmentRepository, productAttachmentsRepository);
		customersRepository = new InMemoryCustomersRepository(usersRepository, registrationRepository);
		createCheckoutUseCase = new CreateCheckoutUseCase(customersRepository, checkoutsRepository);
	});

	it('Should be possible to create a checkout', async () => {
		const user = makeUser();
		const registration = makeRegistration();
		const customer = makeCustomer({
			userId: user.id,
			registrationId: registration.id,
		});

		const product1 = makeProduct();
		const product2 = makeProduct();
		const product3 = makeProduct();

		usersRepository.items.push(user);
		registrationRepository.items.push(registration);
		customersRepository.items.push(customer);
		productsRepository.items.push(product1, product2, product3);

		const result = await createCheckoutUseCase.execute({
			customerId: customer.id.toString(),
			productsIds: [product1.id.toString(), product2.id.toString(), product3.id.toString()],
		});

		expect(result.isSuccess()).toBe(true);
		expect(checkoutsRepository.items).toHaveLength(3);
		expect(result.value).toEqual({
			count: checkoutsRepository.items.length,
		});
	});
});

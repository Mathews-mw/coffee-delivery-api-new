import { Customer } from '@/domains/main/resources/entities/customer';
import { ICustomerRepository, ICustomerResponse, IQuerySearch } from '@/domains/main/application/modules/accounts/repositories/ICustomerRepository';
import { InMemoryUsersRepository } from './in-memory-users-repository';
import { InMemoryRegistrationsRepository } from './in-memory-registrations-repository';
import { CustomerDetails } from '@/domains/main/resources/entities/value-objects/customer-details';

export class InMemoryCustomersRepository implements ICustomerRepository {
	public items: Customer[] = [];

	constructor(
		private usersRepository: InMemoryUsersRepository,
		private registrationRepository: InMemoryRegistrationsRepository
	) {}

	async create(customer: Customer): Promise<Customer> {
		this.items.push(customer);

		return customer;
	}

	async update(customer: Customer): Promise<Customer> {
		const customerIndex = this.items.findIndex((item) => item.id === customer.id);

		this.items[customerIndex] = customer;

		return customer;
	}

	async delete(customer: Customer): Promise<void> {
		const customerIndex = this.items.findIndex((item) => item.id === customer.id);

		this.items.slice(customerIndex, 1);
	}

	async findAll({ page, perPage, search }: IQuerySearch): Promise<ICustomerResponse> {
		const customersPaginated = this.items.slice((page - 1) * perPage, page * perPage);

		const totalOccurrences = customersPaginated.length;
		const totalPages = Math.ceil(totalOccurrences / perPage);

		const pagination = {
			page,
			perPage,
			totalPages,
			totalOccurrences,
		};

		return {
			pagination,
			customers: customersPaginated,
		};
	}

	async findById(id: string) {
		const customer = this.items.find((item) => item.id.toString() === id);

		if (!customer) {
			return null;
		}

		const user = await this.usersRepository.findById(customer.userId.toString());
		const registration = await this.registrationRepository.findById(customer.registrationId.toString());

		if (!user || !registration) {
			return null;
		}

		const customerDetails = {
			id: customer.id,
			userId: customer.userId,
			registrationId: customer.registrationId,
			user,
			registration,
		} as CustomerDetails;

		return customerDetails;
	}

	async findByUserId(userId: string): Promise<Customer | null> {
		const customer = this.items.find((item) => item.userId.toString() === userId);

		if (!customer) {
			return null;
		}

		return customer;
	}

	async findByRegistrationId(registrationId: string): Promise<Customer | null> {
		const customer = this.items.find((item) => item.registrationId.toString() === registrationId);

		if (!customer) {
			return null;
		}

		return customer;
	}
}

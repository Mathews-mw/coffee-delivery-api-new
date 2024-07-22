import { Customer } from '@/domains/main/resources/entities/customer';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { CustomerDetails } from '@/domains/main/resources/entities/value-objects/customer-details';

export interface IQuerySearch extends IPaginationParams {
	search?: string;
}

export interface ICustomerResponse {
	pagination: IPaginationResponse;
	customers: Customer[];
}

export interface ICustomerRepository {
	create(customer: Customer): Promise<Customer>;
	update(customer: Customer): Promise<Customer>;
	delete(customer: Customer): Promise<void>;
	findAll(query: IQuerySearch): Promise<ICustomerResponse>;
	findById(id: string): Promise<CustomerDetails | null>;
	findByUserId(userId: string): Promise<Customer | null>;
	findByRegistrationId(registrationId: string): Promise<Customer | null>;
}

import { Checkout, CheckoutStatusType } from '@/domains/main/resources/entities/checkout';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

export interface IQuerySearch extends IPaginationParams {
	search?: string;
}

export interface ICheckoutResponse {
	pagination: IPaginationResponse;
	checkouts: Checkout[];
}

export interface ICheckoutRepository {
	createMany(checkout: Checkout[]): Promise<number>;
	update(checkout: Checkout): Promise<Checkout>;
	delete(checkout: Checkout): Promise<void>;
	findAll(query: IQuerySearch): Promise<ICheckoutResponse>;
	findById(id: string): Promise<Checkout | null>;
	findManyByOrderId(OrderId: string): Promise<Checkout[]>;
	findManyByCustomerId(customerId: string, status?: CheckoutStatusType): Promise<Checkout[]>;
}

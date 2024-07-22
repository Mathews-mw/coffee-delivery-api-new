import { Order } from '@/domains/main/resources/entities/order';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

export interface IQuerySearch extends IPaginationParams {
	search?: string;
}

export interface IOrderResponse {
	pagination: IPaginationResponse;
	orders: Order[];
}

export interface IOrderRepository {
	create(order: Order): Promise<Order>;
	update(order: Order): Promise<Order>;
	delete(order: Order): Promise<void>;
	findAll(query: IQuerySearch): Promise<IOrderResponse>;
	findById(id: string): Promise<Order | null>;
	findManyByCustomerId(customerId: string): Promise<Order[]>;
}

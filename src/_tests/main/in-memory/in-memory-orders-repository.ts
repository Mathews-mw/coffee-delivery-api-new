import { Order } from '@/domains/main/resources/entities/order';
import { IOrderRepository, IOrderResponse, IQuerySearch } from '@/domains/main/application/modules/orders/repositories/IOrderRepository';

export class InMemoryOrderRepository implements IOrderRepository {
	public items: Order[] = [];

	async create(order: Order): Promise<Order> {
		this.items.push(order);

		return order;
	}

	async update(order: Order): Promise<Order> {
		const orderIndex = this.items.findIndex((item) => item.id === order.id);

		this.items[orderIndex] = order;

		return order;
	}

	async delete(order: Order): Promise<void> {
		const orderIndex = this.items.findIndex((item) => item.id === order.id);

		this.items.slice(orderIndex, 1);
	}

	async findAll({ page, perPage, search }: IQuerySearch): Promise<IOrderResponse> {
		const ordersPaginated = this.items.slice((page - 1) * perPage, page * perPage);

		const totalOccurrences = ordersPaginated.length;
		const totalPages = Math.ceil(totalOccurrences / perPage);

		const pagination = {
			page,
			perPage,
			totalPages,
			totalOccurrences,
		};

		return {
			pagination,
			orders: ordersPaginated,
		};
	}

	async findById(id: string): Promise<Order | null> {
		const order = this.items.find((item) => item.id.toString() === id);

		if (!order) {
			return null;
		}

		return order;
	}

	async findManyByCustomerId(customerId: string): Promise<Order[]> {
		const orders = this.items.filter((item) => item.customerId.toString() === customerId);

		return orders;
	}
}

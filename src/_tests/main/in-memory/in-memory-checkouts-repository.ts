import { Checkout, CheckoutStatusType } from '@/domains/main/resources/entities/checkout';
import { ICheckoutRepository, ICheckoutResponse, IQuerySearch } from '@/domains/main/application/modules/orders/repositories/ICheckoutRepository';

export class InMemoryCheckoutsRepository implements ICheckoutRepository {
	public items: Checkout[] = [];

	async createMany(checkout: Checkout[]): Promise<number> {
		this.items.push(...checkout);

		return this.items.length;
	}

	async update(checkout: Checkout): Promise<Checkout> {
		const checkoutIndex = this.items.findIndex((item) => item.id === checkout.id);

		this.items[checkoutIndex] = checkout;

		return checkout;
	}

	async delete(checkout: Checkout): Promise<void> {
		const checkoutIndex = this.items.findIndex((item) => item.id === checkout.id);

		this.items.slice(checkoutIndex, 1);
	}

	async findAll({ page, perPage }: IQuerySearch): Promise<ICheckoutResponse> {
		const checkoutsPaginated = this.items.slice((page - 1) * perPage, page * perPage);

		const totalOccurrences = checkoutsPaginated.length;
		const totalPages = Math.ceil(totalOccurrences / perPage);

		const pagination = {
			page,
			perPage,
			totalPages,
			totalOccurrences,
		};

		return {
			pagination,
			checkouts: checkoutsPaginated,
		};
	}

	async findById(id: string): Promise<Checkout | null> {
		const checkout = this.items.find((item) => item.id.toString() === id);

		if (!checkout) {
			return null;
		}

		return checkout;
	}

	async findManyByOrderId(orderId: string): Promise<Checkout[]> {
		const checkouts = this.items.filter((item) => (item.orderId ? item.orderId.toString() === orderId : null));

		return checkouts;
	}

	async findManyByCustomerId(customerId: string, status?: CheckoutStatusType): Promise<Checkout[]> {
		const checkouts = this.items.filter((item) => item.customerId.toString() === customerId);

		if (status) {
			return checkouts.filter((item) => item.status === status);
		}

		return checkouts;
	}
}

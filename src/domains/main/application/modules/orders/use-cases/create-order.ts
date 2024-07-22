import { failure, Outcome, success } from '@/core/outcome';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { ICheckoutRepository } from '../repositories/ICheckoutRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Order, OrderPaymentType } from '@/domains/main/resources/entities/order';
import { ICustomerRepository } from '../../accounts/repositories/ICustomerRepository';

interface IUseCaseRequest {
	customerId: string;
	phoneNumber: string;
	cpf: string;
	street: string;
	number: string;
	complement?: string;
	district: string;
	city: string;
	estate: string;
	cep?: string;
	paymentType: OrderPaymentType;
	totalCost: number;
}

type IUseCaseResponse = Outcome<
	ResourceNotFoundError,
	{
		order: Order;
	}
>;

export class CreateOrderUseCase {
	constructor(
		private ordersRepository: IOrderRepository,
		private checkoutRepository: ICheckoutRepository,
		private customerRepository: ICustomerRepository
	) {}

	async execute({
		customerId,
		phoneNumber,
		cpf,
		street,
		number,
		complement,
		district,
		city,
		estate,
		cep,
		paymentType,
		totalCost,
	}: IUseCaseRequest): Promise<IUseCaseResponse> {
		const customer = await this.customerRepository.findById(customerId);

		if (!customer) {
			return failure(new ResourceNotFoundError());
		}

		const order = Order.create({
			customerId: customer.id,
			phoneNumber,
			cpf,
			street,
			number,
			complement,
			district,
			city,
			estate,
			cep,
			totalCost,
			paymentType,
		});

		const result = await this.ordersRepository.create(order);

		const orderCheckouts = await this.checkoutRepository.findManyByCustomerId(customer.id.toString(), 'ACTIVE');

		for (const checkout of orderCheckouts) {
			checkout.status = 'PAID';
			checkout.orderId = order.id;
			await this.checkoutRepository.update(checkout);
		}

		return success({
			order: result,
		});
	}
}

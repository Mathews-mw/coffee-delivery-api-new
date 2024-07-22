import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Checkout } from '@/domains/main/resources/entities/checkout';
import { ICheckoutRepository } from '../repositories/ICheckoutRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ICustomerRepository } from '../../accounts/repositories/ICustomerRepository';

interface IUseCaseRequest {
	customerId: string;
	productsIds: Array<string>;
}

type IUseCaseResponse = Outcome<
	ResourceNotFoundError,
	{
		count: number;
	}
>;

export class CreateCheckoutUseCase {
	constructor(
		private customerRepository: ICustomerRepository,
		private checkoutsRepository: ICheckoutRepository
	) {}

	async execute({ customerId, productsIds }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const customer = await this.customerRepository.findById(customerId);

		if (!customer) {
			return failure(new ResourceNotFoundError());
		}

		const checkouts = productsIds.map((productId) => {
			return Checkout.create({
				customerId: customer.id,
				productId: new UniqueEntityId(productId),
			});
		});

		const result = await this.checkoutsRepository.createMany(checkouts);

		return success({
			count: result,
		});
	}
}

import { failure, Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/main/resources/entities/product';
import { IProductRepository } from '../repositories/IProductRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest {
	productId: string;
}

type IResponse = Outcome<
	ResourceNotFoundError,
	{
		product: Product;
	}
>;

export class GetProductByIdUseCase {
	constructor(private productsRepository: IProductRepository) {}

	async execute({ productId }: IRequest): Promise<IResponse> {
		const product = await this.productsRepository.findById(productId);

		if (!product) {
			return failure(new ResourceNotFoundError());
		}

		return success({ product });
	}
}

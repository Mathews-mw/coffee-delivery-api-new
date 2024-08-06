import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import containerKeysConfig from '@/config/container-keys.config';
import { IProductRepository } from '../repositories/IProductRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ProductDetails } from '@/domains/main/resources/entities/value-objects/product-details';

interface IRequest {
	productId: string;
}

type IResponse = Outcome<
	ResourceNotFoundError,
	{
		product: ProductDetails;
	}
>;

@injectable()
export class GetProductDetailsUseCase {
	constructor(@inject(containerKeysConfig.repositories.products_repository) private productsRepository: IProductRepository) {}

	async execute({ productId }: IRequest): Promise<IResponse> {
		const product = await this.productsRepository.findProductDetail(productId);

		if (!product) {
			return failure(new ResourceNotFoundError());
		}

		return success({ product });
	}
}

import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import containerKeysConfig from '@/config/container-keys.config';
import { IProductRepository } from '../repositories/IProductRepository';
import { IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { ProductDetails } from '@/domains/main/resources/entities/value-objects/product-details';

interface IRequest {
	page: number;
	perPage: number;
	search?: string;
}

type IResponse = Outcome<
	null,
	{
		pagination: IPaginationResponse;
		products: ProductDetails[];
	}
>;

@injectable()
export class ListingProductsUseCase {
	constructor(@inject(containerKeysConfig.repositories.products_repository) private productsRepository: IProductRepository) {}

	async execute({ page, perPage, search }: IRequest): Promise<IResponse> {
		const { pagination, products } = await this.productsRepository.findAll({ page, perPage, search });

		return success({ pagination, products });
	}
}

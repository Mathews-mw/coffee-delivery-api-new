import { Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/main/resources/entities/product';
import { IProductRepository } from '../repositories/IProductRepository';
import { IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

interface IRequest {
	page: number;
	perPage: number;
	search?: string;
}

type IResponse = Outcome<
	null,
	{
		pagination: IPaginationResponse;
		products: Product[];
	}
>;

export class ListingProductsUseCase {
	constructor(private productsRepository: IProductRepository) {}

	async execute({ page, perPage, search }: IRequest): Promise<IResponse> {
		const { pagination, products } = await this.productsRepository.findAll({ page, perPage, search });

		return success({ pagination, products });
	}
}

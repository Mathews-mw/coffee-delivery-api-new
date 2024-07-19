import { Product } from '@/domains/main/resources/entities/product';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

export interface IQuerySearch extends IPaginationParams {
	search?: string;
}

export interface IProductResponse {
	pagination: IPaginationResponse;
	products: Product[];
}

export interface IProductRepository {
	create(product: Product): Promise<Product>;
	update(product: Product): Promise<Product>;
	delete(product: Product): Promise<void>;
	findAll(query: IQuerySearch): Promise<IProductResponse>;
	findById(id: string): Promise<Product | null>;
	findByName(productName: string): Promise<Product | null>;
}

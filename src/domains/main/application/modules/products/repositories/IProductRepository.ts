import { Product } from '@/domains/main/resources/entities/product';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { ProductDetails } from '@/domains/main/resources/entities/value-objects/product-details';

export interface IQuerySearch extends IPaginationParams {
	search?: string;
	available?: boolean;
}

export interface IProductResponse {
	pagination: IPaginationResponse;
	products: ProductDetails[];
}

export interface IProductRepository {
	create(product: Product): Promise<Product>;
	update(product: Product): Promise<Product>;
	delete(product: Product): Promise<void>;
	findAll(query: IQuerySearch): Promise<IProductResponse>;
	findById(id: string): Promise<Product | null>;
	findByName(productName: string): Promise<Product | null>;
	findProductDetail(id: string): Promise<ProductDetails | null>;
}

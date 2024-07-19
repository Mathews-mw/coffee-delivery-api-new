import { failure, Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/main/resources/entities/product';
import { IProductRepository } from '../repositories/IProductRepository';
import { ProductAlreadyExistsError } from './errors/product-already-exists-error';

interface IUseCaseRequest {
	name: string;
	price: number;
	description: string;
}

type IUseCaseResponse = Outcome<
	ProductAlreadyExistsError,
	{
		product: Product;
	}
>;

export class CreateProductUseCase {
	constructor(private productsRepository: IProductRepository) {}

	async execute({ name, price, description }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const productByName = await this.productsRepository.findByName(name);

		if (productByName) {
			return failure(new ProductAlreadyExistsError(name));
		}

		const newProduct = Product.create({
			name,
			price,
			description,
		});

		await this.productsRepository.create(newProduct);

		return success({
			product: newProduct,
		});
	}
}

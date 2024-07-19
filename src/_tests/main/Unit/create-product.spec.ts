import { makeProduct } from '../factories/make-product';
import { InMemoryProductsRepository } from '../in-memory/in-memory-products-repository';
import { CreateProductUseCase } from '@/domains/main/application/modules/products/use-cases/create-product-use-case';
import { ProductAlreadyExistsError } from '@/domains/main/application/modules/products/use-cases/errors/product-already-exists-error';

let productRepository: InMemoryProductsRepository;
let createProductUseCase: CreateProductUseCase;

describe('Create Product', () => {
	beforeEach(() => {
		productRepository = new InMemoryProductsRepository();
		createProductUseCase = new CreateProductUseCase(productRepository);
	});

	test('Should be able to create a new product', async () => {
		const result = await createProductUseCase.execute({
			name: 'Expresso Tradicional',
			description: 'O tradicional café feito com água quente e grãos moídos',
			price: 9.9,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			product: productRepository.items[0],
		});
	});

	test('Should not be able to create a product with the same name', async () => {
		const product = makeProduct({
			name: 'Expresso Tradicional',
		});

		productRepository.items.push(product);

		const result = await createProductUseCase.execute({
			name: 'Expresso Tradicional',
			description: 'O tradicional café feito com água quente e grãos moídos',
			price: 9.9,
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(ProductAlreadyExistsError);
	});
});

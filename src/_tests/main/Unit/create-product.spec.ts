import { makeTag } from '../factories/make-tags';
import { makeProduct } from '../factories/make-product';
import { FakeUploader } from '../storage/fake-uploader';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryProductsRepository } from '../in-memory/in-memory-products-repository';
import { InMemoryProductsTagsRepository } from '../in-memory/in-memory-products-tags-repository';
import { CreateProductUseCase } from '@/domains/main/application/modules/products/use-cases/create-product-use-case';
import { ProductAlreadyExistsError } from '@/domains/main/application/modules/products/use-cases/errors/product-already-exists-error';
import { NegativaValueNotAllowedError } from '@/domains/main/application/modules/products/use-cases/errors/negative-value-not-allowed-error';

let fakeUploader: FakeUploader;
let createProductUseCase: CreateProductUseCase;
let productRepository: InMemoryProductsRepository;
let productTagsRepository: InMemoryProductsTagsRepository;

describe('Create Product Use Case', () => {
	beforeEach(() => {
		fakeUploader = new FakeUploader();
		productTagsRepository = new InMemoryProductsTagsRepository();
		productRepository = new InMemoryProductsRepository(productTagsRepository);
		createProductUseCase = new CreateProductUseCase(fakeUploader, productRepository);
	});

	test('Should be able to create a new product with tags', async () => {
		makeTag({ tagName: 'TRADICIONAL' });
		makeTag({ tagName: 'GELADO' });
		makeTag({ tagName: 'ESPECIAL' });

		const result = await createProductUseCase.execute({
			name: 'Expresso Tradicional',
			description: 'O tradicional café feito com água quente e grãos moídos',
			price: 9.9,
			tagsId: ['1', '2'],
			imageFile: {
				body: Buffer.from(''),
				contentType: 'image/png',
				fileName: 'sample.png',
				fileSize: 328,
			},
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			product: productRepository.items[0],
		});
		expect(productTagsRepository.items).toHaveLength(2);
		expect(productRepository.items[0].tags.currentItems).toEqual([
			expect.objectContaining({ tagId: new UniqueEntityId('1') }),
			expect.objectContaining({ tagId: new UniqueEntityId('2') }),
		]);
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
			tagsId: ['1'],
			imageFile: {
				body: Buffer.from(''),
				contentType: 'image/png',
				fileName: 'sample.png',
				fileSize: 328,
			},
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(ProductAlreadyExistsError);
	});

	test('Should not be able to create a product with negative price', async () => {
		const result = await createProductUseCase.execute({
			name: 'Expresso Tradicional',
			description: 'O tradicional café feito com água quente e grãos moídos',
			price: -9.9,
			tagsId: ['1'],
			imageFile: {
				body: Buffer.from(''),
				contentType: 'image/png',
				fileName: 'sample.png',
				fileSize: 328,
			},
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(NegativaValueNotAllowedError);
	});
});

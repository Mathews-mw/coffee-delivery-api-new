import { makeTag } from '../factories/make-tags';
import { makeProduct } from '../factories/make-product';
import { FakeUploader } from '../storage/fake-uploader';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryProductsRepository } from '../in-memory/in-memory-products-repository';
import { InMemoryAttachmentsRepository } from '../in-memory/in-memory-attachments-repository';
import { InMemoryProductsTagsRepository } from '../in-memory/in-memory-products-tags-repository';
import { InMemoryProductAttachmentRepository } from '../in-memory/in-memory-product-attachments-repository';
import { CreateProductUseCase } from '@/domains/main/application/modules/products/use-cases/create-product-use-case';
import { ProductAlreadyExistsError } from '@/domains/main/application/modules/products/use-cases/errors/product-already-exists-error';
import { NegativaValueNotAllowedError } from '@/domains/main/application/modules/products/use-cases/errors/negative-value-not-allowed-error';

let uploader: FakeUploader;
let createProductUseCase: CreateProductUseCase;
let productRepository: InMemoryProductsRepository;
let attachmentRepository: InMemoryAttachmentsRepository;
let attachmentsRepository: InMemoryAttachmentsRepository;
let productTagsRepository: InMemoryProductsTagsRepository;
let productAttachmentsRepository: InMemoryProductAttachmentRepository;

describe('Create Product Use Case', () => {
	beforeEach(() => {
		uploader = new FakeUploader();
		attachmentRepository = new InMemoryAttachmentsRepository();
		attachmentsRepository = new InMemoryAttachmentsRepository();
		productTagsRepository = new InMemoryProductsTagsRepository();
		productAttachmentsRepository = new InMemoryProductAttachmentRepository(uploader, attachmentsRepository);
		productRepository = new InMemoryProductsRepository(productTagsRepository, attachmentRepository, productAttachmentsRepository);
		createProductUseCase = new CreateProductUseCase(productRepository);
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
			attachmentId: '1',
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
			attachmentId: '1',
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
			attachmentId: '1',
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(NegativaValueNotAllowedError);
	});
});

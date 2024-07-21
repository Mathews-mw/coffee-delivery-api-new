import { makeTag } from '../factories/make-tags';
import { makeProduct } from '../factories/make-product';
import { FakeUploader } from '../storage/fake-uploader';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InMemoryProductsRepository } from '../in-memory/in-memory-products-repository';
import { InMemoryProductsTagsRepository } from '../in-memory/in-memory-products-tags-repository';
import { EditProductUseCase } from '@/domains/main/application/modules/products/use-cases/edit-product-use-case';

let fakeUploader: FakeUploader;
let updateProductUseCase: EditProductUseCase;
let productRepository: InMemoryProductsRepository;
let productTagsRepository: InMemoryProductsTagsRepository;

describe('Edit Product Use Case', () => {
	beforeEach(() => {
		fakeUploader = new FakeUploader();
		productTagsRepository = new InMemoryProductsTagsRepository();
		productRepository = new InMemoryProductsRepository(productTagsRepository);
		updateProductUseCase = new EditProductUseCase(fakeUploader, productRepository, productTagsRepository);
	});

	test('Should be able to edit an existing product', async () => {
		const tag1 = makeTag({ tagName: 'TRADICIONAL' }, new UniqueEntityId('1'));
		const tag2 = makeTag({ tagName: 'GELADO' }, new UniqueEntityId('2'));
		const tag3 = makeTag({ tagName: 'ESPECIAL' }, new UniqueEntityId('3'));

		const product = makeProduct({ imageUrl: 'sample.png' });

		productRepository.create(product);

		productTagsRepository.items.push(
			ProductTag.create({ productId: product.id, tagId: tag1.id }),
			ProductTag.create({ productId: product.id, tagId: tag2.id })
		);

		fakeUploader.uploads.push({
			fileName: 'sample.png',
			url: `sample.png-${Date.now()}`,
		});

		const result = await updateProductUseCase.execute({
			productId: product.id.toString(),
			name: 'Expresso Cremoso',
			price: 9.5,
			tagsId: ['1', '3'],
			imageFile: {
				body: Buffer.from(''),
				contentType: 'image/png',
				fileName: 'another-sample.png',
				fileSize: 328,
			},
		});

		expect(result.isSuccess()).toBe(true);

		expect(productRepository.items[0]).toEqual(
			expect.objectContaining({
				name: 'Expresso Cremoso',
				price: 9.5,
				imageUrl: fakeUploader.uploads[0].url,
			})
		);
		expect(productRepository.items[0].tags.currentItems).toHaveLength(2);
		expect(productRepository.items[0].tags.currentItems).toEqual([
			expect.objectContaining({ tagId: new UniqueEntityId('1') }),
			expect.objectContaining({ tagId: new UniqueEntityId('3') }),
		]);
	});

	test('Should not be able to update a non-existent product', async () => {
		const result = await updateProductUseCase.execute({
			productId: 'non-existent-id',
			name: 'Expresso Cremoso',
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

import { makeTag } from '../factories/make-tags';
import { makeProduct } from '../factories/make-product';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { makeProductAttachment } from '../factories/make-product-attachment';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InMemoryProductsRepository } from '../in-memory/in-memory-products-repository';
import { InMemoryAttachmentsRepository } from '../in-memory/in-memory-attachments-repository';
import { InMemoryProductsTagsRepository } from '../in-memory/in-memory-products-tags-repository';
import { InMemoryProductAttachmentRepository } from '../in-memory/in-memory-product-attachments-repository';
import { EditProductUseCase } from '@/domains/main/application/modules/products/use-cases/edit-product-use-case';
import { FakeUploader } from '../storage/fake-uploader';
import { makeAttachment } from '../factories/make-attachment';

let uploader: FakeUploader;
let updateProductUseCase: EditProductUseCase;
let productRepository: InMemoryProductsRepository;
let attachmentRepository: InMemoryAttachmentsRepository;
let productTagsRepository: InMemoryProductsTagsRepository;
let productAttachmentsRepository: InMemoryProductAttachmentRepository;

describe('Edit Product Use Case', () => {
	beforeEach(() => {
		uploader = new FakeUploader();
		attachmentRepository = new InMemoryAttachmentsRepository();
		productTagsRepository = new InMemoryProductsTagsRepository();
		productAttachmentsRepository = new InMemoryProductAttachmentRepository(uploader, attachmentRepository);
		productRepository = new InMemoryProductsRepository(productTagsRepository, attachmentRepository, productAttachmentsRepository);
		updateProductUseCase = new EditProductUseCase(productRepository, productTagsRepository, productAttachmentsRepository);
	});

	test('Should be able to edit an existing product', async () => {
		const tag1 = makeTag({ tagName: 'TRADICIONAL' }, new UniqueEntityId('1'));
		const tag2 = makeTag({ tagName: 'GELADO' }, new UniqueEntityId('2'));
		const tag3 = makeTag({ tagName: 'ESPECIAL' }, new UniqueEntityId('3'));

		const product = makeProduct({ imageUrl: 'sample.png' });
		productRepository.create(product);

		const attachment = makeAttachment({ fileName: 'sample.png' }, new UniqueEntityId('1'));
		attachmentRepository.items.push(attachment);

		productTagsRepository.items.push(
			ProductTag.create({ productId: product.id, tagId: tag1.id }),
			ProductTag.create({ productId: product.id, tagId: tag2.id })
		);

		const productAttachment = makeProductAttachment({ productId: product.id, attachmentId: attachment.id });
		productAttachmentsRepository.items.push(productAttachment);

		const result = await updateProductUseCase.execute({
			productId: product.id.toString(),
			name: 'Expresso Cremoso',
			price: 9.5,
			tagsId: ['1', '3'],
			attachmentId: '2',
		});

		expect(result.isSuccess()).toBe(true);

		expect(productRepository.items[0]).toEqual(
			expect.objectContaining({
				name: 'Expresso Cremoso',
				price: 9.5,
			})
		);
		expect(productRepository.items[0].tags.currentItems).toHaveLength(2);
		expect(productRepository.items[0].tags.currentItems).toEqual([
			expect.objectContaining({ tagId: new UniqueEntityId('1') }),
			expect.objectContaining({ tagId: new UniqueEntityId('3') }),
		]);
		expect(productRepository.items[0].image.currentItems).toEqual([expect.objectContaining({ attachmentId: new UniqueEntityId('2') })]);
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

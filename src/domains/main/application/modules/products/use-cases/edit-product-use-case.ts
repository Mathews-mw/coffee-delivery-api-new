import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Product } from '@/domains/main/resources/entities/product';
import { IProductRepository } from '../repositories/IProductRepository';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ProductAlreadyExistsError } from './errors/product-already-exists-error';
import { ProductTagList } from '@/domains/main/resources/entities/product-tag-list';
import { IProductTagRepository } from '../../tag/repositories/IProductTagRepository';
import { NegativaValueNotAllowedError } from './errors/negative-value-not-allowed-error';
import { ProductAttachment } from '@/domains/main/resources/entities/product-attachment';
import { IProductAttachmentRepository } from '../repositories/IProductAttachmentRepository';
import { ProductAttachmentList } from '@/domains/main/resources/entities/product-attachment-list';

interface IUseCaseRequest {
	productId: string;
	name?: string;
	price?: number;
	description?: string;
	available?: boolean;
	tagsId?: Array<string>;
	attachmentId?: string;
}

type IUseCaseResponse = Outcome<
	ResourceNotFoundError | ProductAlreadyExistsError | NegativaValueNotAllowedError,
	{
		product: Product;
	}
>;

export class EditProductUseCase {
	constructor(
		private productsRepository: IProductRepository,
		private productsTagsRepository: IProductTagRepository,
		private productAttachmentRepository: IProductAttachmentRepository
	) {}

	async execute({ productId, name, price, description, available, tagsId, attachmentId }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const product = await this.productsRepository.findById(productId);

		if (!product) {
			return failure(new ResourceNotFoundError());
		}

		if (name) {
			const productByName = await this.productsRepository.findById(name);

			if (productByName) {
				return failure(new ProductAlreadyExistsError(name));
			}
		}

		if (price) {
			if (price <= 0) {
				return failure(new NegativaValueNotAllowedError());
			}
		}

		const currentProductTags = await this.productsTagsRepository.findManyByProductId(productId);

		const productTagsList = new ProductTagList(currentProductTags);

		if (tagsId) {
			const productTags = tagsId.map((tagId) => {
				return ProductTag.create({
					productId: product.id,
					tagId: new UniqueEntityId(tagId),
				});
			});

			productTagsList.update(productTags);
		}

		if (attachmentId) {
			const currentProductAttachment = await this.productAttachmentRepository.findByProductId(productId);

			if (currentProductAttachment) {
				const productAttachmentList = new ProductAttachmentList([currentProductAttachment]);

				const productAttachment = ProductAttachment.create({
					productId: product.id,
					attachmentId: new UniqueEntityId(attachmentId),
				});

				productAttachmentList.update([productAttachment]);

				product.image = productAttachmentList;
			}
		}

		product.name = name ?? product.name;
		product.price = price ?? product.price;
		product.description = description ?? product.description;
		product.available = available ?? product.available;
		product.tags = productTagsList;

		await this.productsRepository.update(product);

		return success({
			product,
		});
	}
}

import { IUploader } from '../../../storage/IUploader';
import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Product } from '@/domains/main/resources/entities/product';
import { IProductRepository } from '../repositories/IProductRepository';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ProductAlreadyExistsError } from './errors/product-already-exists-error';
import { ProductTagList } from '@/domains/main/resources/entities/product-tag-list';
import { NegativaValueNotAllowedError } from './errors/negative-value-not-allowed-error';
import { IProductTagRepository } from '../../products-tags/repositories/product-tag-repository';

interface IUseCaseRequest {
	productId: string;
	name?: string;
	price?: number;
	description?: string;
	available?: boolean;
	tagsId?: Array<string>;
	imageFile?: {
		fileName: string;
		fileSize: number;
		contentType: string;
		body: Buffer;
	};
}

type IUseCaseResponse = Outcome<
	ResourceNotFoundError | ProductAlreadyExistsError | NegativaValueNotAllowedError,
	{
		product: Product;
	}
>;

export class EditProductUseCase {
	constructor(
		private uploader: IUploader,
		private productsRepository: IProductRepository,
		private productsTagsRepository: IProductTagRepository
	) {}

	async execute({ productId, name, price, description, available, tagsId, imageFile }: IUseCaseRequest): Promise<IUseCaseResponse> {
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

		if (imageFile) {
			await this.uploader.delete(product.imageUrl);

			const { url } = await this.uploader.upload({
				fileName: imageFile.fileName,
				fileType: imageFile.contentType,
				body: imageFile.body,
			});

			product.imageUrl = url;
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

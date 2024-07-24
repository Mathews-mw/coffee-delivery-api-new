import { IUploader } from '../../../storage/IUploader';
import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Product } from '@/domains/main/resources/entities/product';
import { IProductRepository } from '../repositories/IProductRepository';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { ProductAlreadyExistsError } from './errors/product-already-exists-error';
import { ProductTagList } from '@/domains/main/resources/entities/product-tag-list';
import { NegativaValueNotAllowedError } from './errors/negative-value-not-allowed-error';
import { ProductAttachmentList } from '@/domains/main/resources/entities/product-attachment-list';
import { ProductAttachment } from '@/domains/main/resources/entities/product-attachment';

interface IUseCaseRequest {
	name: string;
	price: number;
	description: string;
	tagsId: Array<string>;
	attachmentId: string;
	imageFile: {
		fileName: string;
		fileSize: number;
		contentType: string;
		body: Buffer;
	};
}

type IUseCaseResponse = Outcome<
	ProductAlreadyExistsError | NegativaValueNotAllowedError,
	{
		product: Product;
	}
>;

export class CreateProductUseCase {
	constructor(
		private uploader: IUploader,
		private productsRepository: IProductRepository
	) {}

	async execute({ name, price, description, tagsId, attachmentId, imageFile }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const productByName = await this.productsRepository.findByName(name);

		if (productByName) {
			return failure(new ProductAlreadyExistsError(name));
		}

		if (price <= 0) {
			return failure(new NegativaValueNotAllowedError());
		}

		const { url } = await this.uploader.upload({
			fileName: imageFile.fileName,
			fileType: imageFile.contentType,
			body: imageFile.body,
		});

		const newProduct = Product.create({
			name,
			price,
			description,
		});

		const productTags = tagsId.map((tagId) => {
			return ProductTag.create({
				productId: newProduct.id,
				tagId: new UniqueEntityId(tagId),
			});
		});

		const productAttachment = ProductAttachment.create({
			productId: newProduct.id,
			attachmentId: new UniqueEntityId(attachmentId),
		});

		newProduct.tags = new ProductTagList(productTags);
		newProduct.image = new ProductAttachmentList([productAttachment]);

		await this.productsRepository.create(newProduct);

		return success({
			product: newProduct,
		});
	}
}

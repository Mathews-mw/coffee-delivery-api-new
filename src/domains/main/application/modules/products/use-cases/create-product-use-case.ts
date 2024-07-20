import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Product } from '@/domains/main/resources/entities/product';
import { IProductRepository } from '../repositories/IProductRepository';
import { ProductTag } from '@/domains/main/resources/entities/product-tag';
import { ProductAlreadyExistsError } from './errors/product-already-exists-error';
import { ProductTagList } from '@/domains/main/resources/entities/product-tag-list';
import { NegativaValueNotAllowedError } from './errors/negative-value-not-allowed-error';
import { IUploader } from '../../../storage/IUploader';

interface IUseCaseRequest {
	name: string;
	price: number;
	description: string;
	tagsId: Array<string>;
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

	async execute({ name, price, description, tagsId, imageFile }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const productByName = await this.productsRepository.findByName(name);

		if (productByName) {
			return failure(new ProductAlreadyExistsError(name));
		}

		if (price <= 0) {
			return failure(new NegativaValueNotAllowedError());
		}

		const imageFileName = `${imageFile.fileName}-${Date.now()}`;

		const { url } = await this.uploader.upload({
			fileName: imageFileName,
			fileType: imageFile.contentType,
			body: imageFile.body,
		});

		const newProduct = Product.create({
			name,
			price,
			description,
			imageUrl: url,
		});

		const productTags = tagsId.map((tagId) => {
			return ProductTag.create({
				productId: newProduct.id,
				tagId: new UniqueEntityId(tagId),
			});
		});

		newProduct.tags = new ProductTagList(productTags);

		await this.productsRepository.create(newProduct);

		return success({
			product: newProduct,
		});
	}
}

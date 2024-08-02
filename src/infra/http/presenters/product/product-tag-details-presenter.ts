import { ProductTagDetails } from '@/domains/main/resources/entities/value-objects/product-tag-details';

export class ProductTagDetailsPresenter {
	static toHTTP(productTag: ProductTagDetails) {
		return {
			tag_id: productTag.tagId.toString(),
			product_id: productTag.productId.toString(),
			tag_name: productTag.tag.tagName,
		};
	}
}

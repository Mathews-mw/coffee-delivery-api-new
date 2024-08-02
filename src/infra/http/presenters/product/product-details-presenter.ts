import dayjs from 'dayjs';

import { ProductTagDetailsPresenter } from './product-tag-details-presenter';
import { ProductDetails } from '@/domains/main/resources/entities/value-objects/product-details';

export class ProductDetailsPresenter {
	static toHTTP(product: ProductDetails) {
		return {
			id: product.id.toString(),
			name: product.name,
			price: product.price,
			description: product.description,
			available: product.available,
			image_url: product.imageUrl,
			tags: product.tags.map(ProductTagDetailsPresenter.toHTTP),
			created_at: dayjs(product.createdAt).format('DD/MM/YYYY'),
			updated_at: dayjs(product.updatedAt).format('DD/MM/YYYY'),
		};
	}
}

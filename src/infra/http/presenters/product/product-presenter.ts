import { Product } from '@/domains/main/resources/entities/product';

export class ProductPresenter {
	static toHTTP(product: Product) {
		return {
			id: product.id.toString(),
			name: product.name,
			price: product.price,
			description: product.description,
			available: product.available,
			created_at: product.createdAt,
			updated_at: product.updatedAt,
		};
	}
}

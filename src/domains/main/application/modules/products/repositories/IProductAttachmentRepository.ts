import { ProductAttachment } from '@/domains/main/resources/entities/product-attachment';

export interface IProductAttachmentRepository {
	create(productAttachment: ProductAttachment): Promise<void>;
	delete(productAttachment: ProductAttachment): Promise<void>;
	deleteByProductId(productId: string): Promise<void>;
	findById(id: string): Promise<ProductAttachment | null>;
	findByProductId(productId: string): Promise<ProductAttachment | null>;
}

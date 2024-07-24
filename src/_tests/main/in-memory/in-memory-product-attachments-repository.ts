import { ProductAttachment } from '@/domains/main/resources/entities/product-attachment';
import { IProductAttachmentRepository } from '@/domains/main/application/modules/products/repositories/IProductAttachmentRepository';

export class InMemoryProductAttachmentRepository implements IProductAttachmentRepository {
	public items: ProductAttachment[] = [];

	async create(productAttachment: ProductAttachment): Promise<void> {
		this.items.push(productAttachment);
	}

	async delete(productAttachment: ProductAttachment): Promise<void> {
		const attachmentIndex = this.items.findIndex((item) => item.id === productAttachment.id);

		this.items.slice(attachmentIndex, 1);
	}

	async deleteByProductId(productId: string): Promise<void> {
		const attachmentIndex = this.items.findIndex((item) => item.productId.toString() === productId);

		this.items.slice(attachmentIndex, 1);
	}

	async findById(id: string): Promise<ProductAttachment | null> {
		const productAttachment = this.items.find((item) => item.id.toString() === id);

		if (!productAttachment) {
			return null;
		}

		return productAttachment;
	}

	async findByProductId(productId: string): Promise<ProductAttachment | null> {
		const productAttachment = this.items.find((item) => item.productId.toString() === productId);

		if (!productAttachment) {
			return null;
		}

		return productAttachment;
	}
}

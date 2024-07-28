import { ProductAttachment } from '@/domains/main/resources/entities/product-attachment';
import { IProductAttachmentRepository } from '@/domains/main/application/modules/products/repositories/IProductAttachmentRepository';
import { FakeUploader } from '../storage/fake-uploader';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';

export class InMemoryProductAttachmentRepository implements IProductAttachmentRepository {
	public items: ProductAttachment[] = [];

	constructor(
		private uploader: FakeUploader,
		private attachmentsRepository: InMemoryAttachmentsRepository
	) {}

	async create(productAttachment: ProductAttachment): Promise<void> {
		this.items.push(productAttachment);
	}

	async delete(productAttachment: ProductAttachment): Promise<void> {
		const attachmentIndex = this.items.findIndex((item) => item.id === productAttachment.id);

		const attachment = await this.attachmentsRepository.findById(productAttachment.attachmentId.toString());

		if (attachment) {
			await this.uploader.delete(attachment.fileName);
		}

		this.items.slice(attachmentIndex, 1);
	}

	async deleteByProductId(productId: string): Promise<void> {
		const attachmentIndex = this.items.findIndex((item) => item.productId.toString() === productId);

		const attachment = await this.attachmentsRepository.findById(productId);

		if (attachment) {
			await this.uploader.delete(attachment.fileName);
		}

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

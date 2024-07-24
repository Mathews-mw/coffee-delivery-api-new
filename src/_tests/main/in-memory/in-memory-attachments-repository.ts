import { Attachment } from '@/domains/main/resources/entities/attachment';
import { IAttachmentRepository } from '@/domains/main/application/modules/products/repositories/IAttachmentRepository';

export class InMemoryAttachmentsRepository implements IAttachmentRepository {
	public items: Attachment[] = [];

	async create(attachment: Attachment): Promise<void> {
		this.items.push(attachment);
	}
}

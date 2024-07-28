import { Attachment } from '@/domains/main/resources/entities/attachment';

export interface IAttachmentRepository {
	create(image: Attachment): Promise<void>;
	delete(fileName: string): Promise<void>;
	findById(id: string): Promise<Attachment | null>;
	findByProductId(productId: string): Promise<Attachment | null>;
}

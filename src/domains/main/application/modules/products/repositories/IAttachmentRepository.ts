import { Attachment } from '@/domains/main/resources/entities/attachment';

export interface IAttachmentRepository {
	create(image: Attachment): Promise<void>;
}

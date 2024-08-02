import { Attachment } from '@/domains/main/resources/entities/attachment';

export class AttachmentPresenter {
	static toHTTP(attachment: Attachment) {
		return {
			id: attachment.id.toString(),
			file_name: attachment.fileName,
			url: attachment.url,
		};
	}
}

import { Outcome, success } from '@/core/outcome';
import { IUploader } from '../../../storage/IUploader';
import { Attachment } from '@/domains/main/resources/entities/attachment';
import { IAttachmentRepository } from '../repositories/IAttachmentRepository';

interface IUseCaseRequest {
	imageFile: {
		fileName: string;
		fileSize: number;
		contentType: string;
		body: Buffer;
	};
}

type IUseCaseResponse = Outcome<
	null,
	{
		attachment: Attachment;
	}
>;

export class UploadProductImageUseCase {
	constructor(
		private uploader: IUploader,
		private attachmentRepository: IAttachmentRepository
	) {}

	async execute({ imageFile }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const { url } = await this.uploader.upload({
			fileName: imageFile.fileName,
			fileType: imageFile.contentType,
			body: imageFile.body,
		});

		const attachment = Attachment.create({
			fileName: imageFile.fileName,
			url,
		});

		await this.attachmentRepository.create(attachment);

		return success({
			attachment,
		});
	}
}

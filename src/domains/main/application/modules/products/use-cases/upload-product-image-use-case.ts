import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { IUploader } from '../../../storage/IUploader';
import containerKeys from '@/config/container-keys.config';
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

@injectable()
export class UploadProductImageUseCase {
	constructor(
		@inject(containerKeys.storage.r2_storage) private uploader: IUploader,
		@inject(containerKeys.repositories.attachments_repository) private attachmentRepository: IAttachmentRepository
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

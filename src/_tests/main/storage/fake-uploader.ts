import { IUploader, IUploadParams } from '@/domains/main/application/storage/IUploader';
import { randomUUID } from 'node:crypto';

export interface IUploadProps {
	fileName: string;
	url: string;
}

export class FakeUploader implements IUploader {
	public uploads: IUploadProps[] = [];

	async upload({ fileName }: IUploadParams): Promise<{ url: string }> {
		const url = randomUUID();

		this.uploads.push({
			fileName,
			url,
		});

		return { url };
	}

	async delete(fileName: string): Promise<void> {
		const files = this.uploads.filter((item) => item.fileName !== fileName);

		this.uploads = files;
	}
}

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from '../env';
import { IUploader, IUploadParams } from '@/domains/main/application/storage/IUploader';
import { injectable } from 'tsyringe';

export class R2Storage implements IUploader {
	private client: S3Client;

	constructor() {
		const accountId = env.CLOUDFLARE_ACCOUNT_ID;

		this.client = new S3Client({
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			region: 'auto',
			credentials: {
				accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
				secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
			},
		});
	}

	async upload({ fileName, fileType, body }: IUploadParams): Promise<{ url: string }> {
		const uniqueFileName = `${fileName}-${Date.now()}`;

		await this.client.send(
			new PutObjectCommand({
				Bucket: env.CLOUDFLARE_BUCKET_NAME,
				Key: uniqueFileName,
				ContentType: fileType,
				Body: body,
			})
		);

		return { url: uniqueFileName };
	}

	async delete(fileName: string): Promise<void> {
		await this.client.send(
			new DeleteObjectCommand({
				Bucket: env.CLOUDFLARE_BUCKET_NAME,
				Key: fileName,
			})
		);
	}
}

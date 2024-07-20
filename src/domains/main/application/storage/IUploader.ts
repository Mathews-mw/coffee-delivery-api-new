export interface IUploadParams {
	fileName: string;
	fileType: string;
	body: Buffer;
}

export interface IUploader {
	upload(params: IUploadParams): Promise<{ url: string }>;
	delete(fileName: string): Promise<void>;
}

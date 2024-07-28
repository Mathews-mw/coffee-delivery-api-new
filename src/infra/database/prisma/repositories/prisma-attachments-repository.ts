import { prisma } from '../prisma';
import { Attachment } from '@/domains/main/resources/entities/attachment';
import { PrismaAttachmentMapper } from './mappers/prisma-attachment-mapper';
import { IAttachmentRepository } from '@/domains/main/application/modules/products/repositories/IAttachmentRepository';

export class PrismaAttachmentsRepository implements IAttachmentRepository {
	async create(image: Attachment): Promise<void> {
		const data = PrismaAttachmentMapper.toPrisma(image);
		console.log('data: ', data);

		await prisma.attachment.create({
			data,
		});
	}

	async delete(fileName: string): Promise<void> {
		await prisma.attachment.delete({
			where: {
				fileName,
			},
		});
	}

	async findById(id: string): Promise<Attachment | null> {
		const attachment = await prisma.attachment.findUnique({
			where: {
				id,
			},
		});

		if (!attachment) {
			return null;
		}

		return PrismaAttachmentMapper.toDomain(attachment);
	}

	async findByProductId(productId: string): Promise<Attachment | null> {
		const attachment = await prisma.attachment.findUnique({
			where: {
				productId,
			},
		});

		if (!attachment) {
			return null;
		}

		return PrismaAttachmentMapper.toDomain(attachment);
	}
}

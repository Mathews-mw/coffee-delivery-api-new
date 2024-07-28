import { prisma } from '../prisma';
import { ProductAttachment } from '@/domains/main/resources/entities/product-attachment';
import { PrismaProductAttachmentMapper } from './mappers/prisma-product-attachment-mapper';
import { IProductAttachmentRepository } from '@/domains/main/application/modules/products/repositories/IProductAttachmentRepository';

export class PrismaProductsAttachmentsRepository implements IProductAttachmentRepository {
	async create(productAttachment: ProductAttachment): Promise<void> {
		await prisma.attachment.update({
			data: {
				productId: productAttachment.productId.toString(),
			},
			where: {
				id: productAttachment.attachmentId.toString(),
			},
		});
	}

	async delete(productAttachment: ProductAttachment): Promise<void> {
		await prisma.attachment.delete({
			where: {
				id: productAttachment.attachmentId.toString(),
			},
		});
	}

	async deleteByProductId(productId: string): Promise<void> {
		await prisma.attachment.delete({
			where: {
				productId,
			},
		});
	}

	async findById(id: string): Promise<ProductAttachment | null> {
		const productAttachment = await prisma.attachment.findUnique({
			where: {
				id,
			},
		});

		if (!productAttachment) {
			return null;
		}

		return PrismaProductAttachmentMapper.toDomain(productAttachment);
	}

	async findByProductId(productId: string): Promise<ProductAttachment | null> {
		const productAttachment = await prisma.attachment.findUnique({
			where: {
				productId,
			},
		});

		if (!productAttachment) {
			return null;
		}

		return PrismaProductAttachmentMapper.toDomain(productAttachment);
	}
}

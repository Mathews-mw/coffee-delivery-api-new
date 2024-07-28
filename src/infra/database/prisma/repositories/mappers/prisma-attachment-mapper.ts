import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';
import { Attachment } from '@/domains/main/resources/entities/attachment';

export class PrismaAttachmentMapper {
	static toDomain(raw: PrismaAttachment): Attachment {
		return Attachment.create(
			{
				fileName: raw.fileName,
				url: raw.url,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
		return {
			id: attachment.id.toString(),
			fileName: attachment.fileName,
			url: attachment.url,
		};
	}
}

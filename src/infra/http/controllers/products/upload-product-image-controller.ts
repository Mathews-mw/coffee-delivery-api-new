import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadProductImageUseCase } from '@/domains/main/application/modules/products/use-cases/upload-product-image-use-case';

export async function uploadProductImageController(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
	const MAX_FILE_SIZE = 15000000; // 15mb
	const ACCEPTED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];
	const importBodySchema = z.object({
		fieldname: z.string().min(1, { message: 'Arquivo de imagem obrigatório' }),
		originalname: z.string(),
		encoding: z.string(),
		mimetype: z.string().refine((file) => ACCEPTED_IMAGE_TYPES.includes(file), {
			message: "Apenas arquivos no formato '.jpg', .'jpeg' e '.png' são permitidos.",
		}),
		size: z.number().refine((file) => file <= MAX_FILE_SIZE, {
			message: 'O tamanho máximo permitida da imagem é de 15Mb.',
		}),
		buffer: z.instanceof(Buffer),
	});

	const data = importBodySchema.parse(request.file);

	try {
		const uploadServiceNoteAttachmentUseCase = container.resolve(UploadProductImageUseCase);

		await uploadServiceNoteAttachmentUseCase.execute({
			imageFile: {
				fileName: data.originalname,
				fileSize: data.size,
				contentType: data.mimetype,
				body: data.buffer,
			},
		});

		return reply.status(201).send();
	} catch (error) {
		console.log('uploadProductImageController error: ', error);

		return reply.status(400).send({ message: 'Erro ao tentar fazer upload da imagem.' });
	}
}

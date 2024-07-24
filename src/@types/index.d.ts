import 'fastify';
import { File } from 'fastify-multer/lib/interfaces';

declare module 'fastify' {
	export interface FastifyRequest {
		file: File;
		files: File[];
		user: {
			sub: string;
			role: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
		};
	}
}

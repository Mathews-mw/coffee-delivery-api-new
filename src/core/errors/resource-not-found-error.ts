import { IUseCaseError } from '@/core/errors/IUseCaseError';

export class ResourceNotFoundError extends Error implements IUseCaseError {
	constructor() {
		super('Recurso não encontrado.');
	}
}

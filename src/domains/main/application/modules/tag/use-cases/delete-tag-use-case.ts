import { failure, Outcome, success } from '@/core/outcome';
import { ITagRepository } from '../repositories/ITagRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IUseCaseRequest {
	tagId: string;
}

type IUseCaseResponse = Outcome<ResourceNotFoundError, null>;

export class CreateTagUseCase {
	constructor(private tagsRepository: ITagRepository) {}

	async execute({ tagId }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const tag = await this.tagsRepository.findById(tagId);

		if (!tag) {
			return failure(new ResourceNotFoundError());
		}

		await this.tagsRepository.delete(tag);

		return success(null);
	}
}

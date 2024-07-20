import { failure, Outcome, success } from '@/core/outcome';
import { Tag } from '@/domains/main/resources/entities/tag';
import { ITagRepository } from '../repositories/ITagRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest {
	tagId: string;
}

type IResponse = Outcome<
	ResourceNotFoundError,
	{
		tag: Tag;
	}
>;

export class GetTagByIdUseCase {
	constructor(private tagsRepository: ITagRepository) {}

	async execute({ tagId }: IRequest): Promise<IResponse> {
		const tag = await this.tagsRepository.findById(tagId);

		if (!tag) {
			return failure(new ResourceNotFoundError());
		}

		return success({ tag });
	}
}

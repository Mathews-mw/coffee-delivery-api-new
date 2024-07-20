import { failure, Outcome, success } from '@/core/outcome';
import { Tag } from '@/domains/main/resources/entities/tag';
import { ITagRepository } from '../repositories/ITagRepository';
import { TagAlreadyExistsError } from './errors/tag-already-exists-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IUseCaseRequest {
	tagId: string;
	TagName: string;
}

type IUseCaseResponse = Outcome<
	ResourceNotFoundError | TagAlreadyExistsError,
	{
		tag: Tag;
	}
>;

export class TagTagUseCase {
	constructor(private tagsRepository: ITagRepository) {}

	async execute({ tagId, TagName }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const tag = await this.tagsRepository.findById(tagId);

		if (!tag) {
			return failure(new ResourceNotFoundError());
		}

		const tagByName = await this.tagsRepository.findById(TagName);

		if (tagByName) {
			return failure(new TagAlreadyExistsError(TagName));
		}

		tag.tagName = TagName;

		await this.tagsRepository.update(tag);

		return success({
			tag,
		});
	}
}

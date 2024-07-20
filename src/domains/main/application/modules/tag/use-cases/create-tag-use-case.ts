import { failure, Outcome, success } from '@/core/outcome';
import { Tag } from '@/domains/main/resources/entities/tag';
import { ITagRepository } from '../repositories/ITagRepository';
import { TagAlreadyExistsError } from './errors/tag-already-exists-error';

interface IUseCaseRequest {
	tagName: string;
}

type IUseCaseResponse = Outcome<
	TagAlreadyExistsError,
	{
		tag: Tag;
	}
>;

export class CreateTagUseCase {
	constructor(private tagsRepository: ITagRepository) {}

	async execute({ tagName }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const tagByName = await this.tagsRepository.findByTagName(tagName);

		if (tagByName) {
			return failure(new TagAlreadyExistsError(tagName));
		}

		const newTag = Tag.create({
			tagName,
		});

		await this.tagsRepository.create(newTag);

		return success({
			tag: newTag,
		});
	}
}

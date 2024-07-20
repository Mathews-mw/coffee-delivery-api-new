import { Outcome, success } from '@/core/outcome';
import { Tag } from '@/domains/main/resources/entities/tag';
import { ITagRepository } from '../repositories/ITagRepository';

interface IRequest {
	search?: string;
}

type IResponse = Outcome<
	null,
	{
		tags: Tag[];
	}
>;

export class ListingTagsUseCase {
	constructor(private tagsRepository: ITagRepository) {}

	async execute({ search }: IRequest): Promise<IResponse> {
		const tags = await this.tagsRepository.findAll({ search });

		return success({ tags });
	}
}

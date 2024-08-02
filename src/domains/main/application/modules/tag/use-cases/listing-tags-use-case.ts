import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { Tag } from '@/domains/main/resources/entities/tag';
import { ITagRepository } from '../repositories/ITagRepository';
import containerKeysConfig from '@/config/container-keys.config';

interface IRequest {
	search?: string;
}

type IResponse = Outcome<
	null,
	{
		tags: Tag[];
	}
>;

@injectable()
export class ListingTagsUseCase {
	constructor(@inject(containerKeysConfig.repositories.tags_repository) private tagsRepository: ITagRepository) {}

	async execute({ search }: IRequest): Promise<IResponse> {
		const tags = await this.tagsRepository.findAll({ search });

		return success({ tags });
	}
}

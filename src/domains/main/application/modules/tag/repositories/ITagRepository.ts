import { Tag } from '@/domains/main/resources/entities/tag';

export interface IQuerySearch {
	search?: string;
}

export interface ITagRepository {
	create(tag: Tag): Promise<Tag>;
	update(tag: Tag): Promise<Tag>;
	delete(tag: Tag): Promise<void>;
	findAll(query: IQuerySearch): Promise<Tag[]>;
	findById(id: string): Promise<Tag | null>;
	findByTagName(tagName: string): Promise<Tag | null>;
}

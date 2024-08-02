import { Tag } from '@/domains/main/resources/entities/tag';

export class TagPresenter {
	static toHTTP(tag: Tag) {
		return {
			id: tag.id.toString(),
			tag_name: tag.tagName,
		};
	}
}

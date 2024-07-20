import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ITagProps {
	tagName: string;
}

export class Tag extends Entity<ITagProps> {
	get tagName() {
		return this.props.tagName;
	}

	set tagName(tag: string) {
		this.props.tagName = tag;
	}

	static create(props: ITagProps, id?: UniqueEntityId) {
		const tag = new Tag(
			{
				tagName: props.tagName,
			},
			id
		);

		return tag;
	}
}

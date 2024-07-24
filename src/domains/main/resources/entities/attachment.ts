import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IAttachmentProps {
	fileName: string;
	url: string;
}

export class Attachment extends Entity<IAttachmentProps> {
	get url() {
		return this.props.url;
	}

	get fileName() {
		return this.props.fileName;
	}

	static create(props: IAttachmentProps, id?: UniqueEntityId) {
		const attachment = new Attachment(props, id);

		return attachment;
	}
}

import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ICustomerProps {
	userId: UniqueEntityId;
	registrationId: UniqueEntityId;
}

export class Customer extends Entity<ICustomerProps> {
	get userId() {
		return this.props.userId;
	}

	get registrationId() {
		return this.props.registrationId;
	}

	static create(props: ICustomerProps, id?: UniqueEntityId) {
		const customer = new Customer(props, id);

		return customer;
	}
}

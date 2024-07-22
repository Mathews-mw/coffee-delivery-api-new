import { User } from '../user';
import { Registration } from '../registration';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ICustomerDetailsProps {
	id: UniqueEntityId;
	userId: UniqueEntityId;
	registrationId: UniqueEntityId;
	user: User;
	registration: Registration;
}

export class CustomerDetails extends ValueObject<ICustomerDetailsProps> {
	get id() {
		return this.props.id;
	}

	get userId() {
		return this.props.userId;
	}

	get registrationId() {
		return this.props.registrationId;
	}

	get user() {
		return this.props.user;
	}

	get registration() {
		return this.props.registration;
	}

	static create(props: ICustomerDetailsProps) {
		const customerDetails = new CustomerDetails(props);

		return customerDetails;
	}
}

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const checkoutStatusType = ['ACTIVE', 'INACTIVE', 'PAID', 'CANCELED'] as const;

export type CheckoutStatusType = (typeof checkoutStatusType)[number];

export interface ICheckoutProps {
	productId: UniqueEntityId;
	customerId: UniqueEntityId;
	orderId?: UniqueEntityId;
	status: CheckoutStatusType;
	createdAt: Date;
}

export class Checkout extends Entity<ICheckoutProps> {
	get productId() {
		return this.props.productId;
	}

	get customerId() {
		return this.props.customerId;
	}

	get orderId(): UniqueEntityId | undefined {
		return this.props.orderId;
	}

	set orderId(orderId: UniqueEntityId) {
		this.props.orderId = orderId;
	}

	get status() {
		return this.props.status;
	}

	set status(status: CheckoutStatusType) {
		this.props.status = status;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Optional<ICheckoutProps, 'status' | 'orderId' | 'createdAt'>, id?: UniqueEntityId) {
		const checkout = new Checkout(
			{
				status: props.status ?? 'ACTIVE',
				createdAt: new Date(),
				...props,
			},
			id
		);

		return checkout;
	}
}

import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const orderPaymentType = ['MONEY', 'CREDIT', 'DEBIT', 'PIX'] as const;
export const orderStatusType = ['AWAITING_PAYMENT', 'PROCESSING', 'DELIVERING', 'DELIVERED', 'CANCELED'] as const;

export type OrderPaymentType = (typeof orderPaymentType)[number];
export type OrderStatusType = (typeof orderStatusType)[number];

export interface IOrderProps {
	customerId: UniqueEntityId;
	phoneNumber: string;
	cpf: string;
	street: string;
	number: string;
	complement?: string | null;
	district: string;
	city: string;
	estate: string;
	cep?: string | null;
	paymentType: OrderPaymentType;
	totalCost: number;
	status: OrderStatusType;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Order extends Entity<IOrderProps> {
	get customerId() {
		return this.props.customerId;
	}

	get phoneNumber() {
		return this.props.phoneNumber;
	}

	set phoneNumber(phoneNumber: string) {
		this.props.phoneNumber = phoneNumber;
		this.touch();
	}

	get cpf() {
		return this.props.cpf;
	}

	set cpf(cpf: string) {
		this.props.cpf = cpf;
		this.touch();
	}

	get street() {
		return this.props.street;
	}

	set street(street: string) {
		this.props.street = street;
		this.touch();
	}

	get number() {
		return this.props.number;
	}

	set number(number: string) {
		this.props.number = number;
		this.touch();
	}

	get complement(): string | undefined | null {
		return this.props.complement;
	}

	set complement(complement: string) {
		this.props.complement = complement;
		this.touch();
	}

	get district() {
		return this.props.district;
	}

	set district(district: string) {
		this.props.district = district;
		this.touch();
	}

	get city() {
		return this.props.city;
	}

	set city(city: string) {
		this.props.city = city;
		this.touch();
	}

	get estate() {
		return this.props.estate;
	}

	set estate(estate: string) {
		this.props.estate = estate;
		this.touch();
	}

	get cep(): string | undefined | null {
		return this.props.cep;
	}

	set cep(cep: string) {
		this.props.cep = cep;
		this.touch();
	}

	get paymentType() {
		return this.props.paymentType;
	}

	set paymentType(paymentType: OrderPaymentType) {
		this.props.paymentType = paymentType;
		this.touch();
	}

	get totalCost() {
		return this.props.totalCost;
	}

	set totalCost(totalCost: number) {
		this.props.totalCost = totalCost;
		this.touch();
	}

	get status() {
		return this.props.status;
	}

	set status(status: OrderStatusType) {
		this.props.status = status;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IOrderProps, 'complement' | 'cep' | 'status' | 'createdAt'>, id?: UniqueEntityId) {
		const order = new Order(
			{
				status: props.status ?? 'PROCESSING',
				createdAt: new Date(),
				...props,
			},
			id
		);

		return order;
	}
}

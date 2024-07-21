import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IRegistrationProps {
	phoneNumber: string;
	cpf: string;
	street: string;
	number: string;
	complement?: string;
	district: string;
	city: string;
	estate: string;
	cep?: string;
}

export class Registration extends Entity<IRegistrationProps> {
	get phoneNumber() {
		return this.props.phoneNumber;
	}

	set phoneNumber(phoneNumber: string) {
		this.props.phoneNumber = phoneNumber;
	}

	get cpf() {
		return this.props.cpf;
	}

	set cpf(cpf: string) {
		this.props.cpf = cpf;
	}

	get street() {
		return this.props.street;
	}

	set street(street: string) {
		this.props.street = street;
	}

	get number() {
		return this.props.number;
	}

	set number(number: string) {
		this.props.number = number;
	}

	get complement(): string | undefined {
		return this.props.complement;
	}

	set complement(complement: string) {
		this.props.complement = complement;
	}

	get district() {
		return this.props.district;
	}

	set district(district: string) {
		this.props.district = district;
	}

	get city() {
		return this.props.city;
	}

	set city(city: string) {
		this.props.city = city;
	}

	get estate() {
		return this.props.estate;
	}

	set estate(estate: string) {
		this.props.estate = estate;
	}

	get cep(): string | undefined {
		return this.props.cep;
	}

	set cep(cep: string) {
		this.props.cep = cep;
	}

	static create(props: Optional<IRegistrationProps, 'complement' | 'cep'>, id?: UniqueEntityId) {
		const registration = new Registration(
			{
				...props,
			},
			id
		);

		return registration;
	}
}

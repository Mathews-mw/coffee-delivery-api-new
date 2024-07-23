import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const userRolesTypes = ['ADMIN', 'CUSTOMER', 'EMPLOYEE'] as const;

export type UserRoleType = (typeof userRolesTypes)[number];

export interface IUserProps {
	name: string;
	email: string;
	password?: string | null;
	role: UserRoleType;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class User extends Entity<IUserProps> {
	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
		this.touch();
	}

	get email() {
		return this.props.email;
	}

	set email(email: string) {
		this.props.email = email;
		this.touch();
	}

	get password(): string | null | undefined {
		return this.props.password;
	}

	set password(password: string) {
		this.props.password = password;
		this.touch();
	}

	get role() {
		return this.props.role;
	}

	set role(role: UserRoleType) {
		this.props.role = role;
		this.touch();
	}

	get isActive() {
		return this.props.isActive;
	}

	set isActive(isActive: boolean) {
		this.props.isActive = isActive;
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

	static create(props: Optional<IUserProps, 'password' | 'isActive' | 'role' | 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const user = new User(
			{
				password: props.password ?? undefined,
				role: props.role ?? 'CUSTOMER',
				isActive: props.isActive ?? true,
				createdAt: new Date(),
				...props,
			},
			id
		);

		return user;
	}
}

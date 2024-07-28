import bcrypt from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import containerKeys from '@/config/container-keys.config';
import { failure, Outcome, success } from '@/core/outcome';
import { IUserRepository } from '../repositories/IUserRepository';
import { User, UserRoleType } from '@/domains/main/resources/entities/user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface IUseCaseRequest {
	name: string;
	email: string;
	password?: string;
	role?: UserRoleType;
}

type IUseCaseResponse = Outcome<
	UserAlreadyExistsError,
	{
		user: User;
	}
>;

@injectable()
export class CreateUserUseCase {
	constructor(@inject(containerKeys.repositories.users_repository) private usersRepository: IUserRepository) {}

	async execute({ name, email, password, role }: IUseCaseRequest): Promise<IUseCaseResponse> {
		// await new Promise((resolve) => setTimeout(resolve, 3000));
		const userByEmail = await this.usersRepository.findByEmail(email);

		if (userByEmail) {
			return failure(new UserAlreadyExistsError(email));
		}

		let userPassword: string | undefined;

		if (password) {
			const passwordHash = await bcrypt.hash(password, 6);
			userPassword = passwordHash;
		}

		const user = User.create({
			name,
			email,
			password: userPassword,
			role,
		});

		await this.usersRepository.create(user);

		return success({
			user,
		});
	}
}

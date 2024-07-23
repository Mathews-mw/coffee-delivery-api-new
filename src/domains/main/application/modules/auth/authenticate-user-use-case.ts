import bcrypt from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { containersKeysMap } from '@/shared/containers';
import { failure, Outcome, success } from '@/core/outcome';
import { User } from '@/domains/main/resources/entities/user';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { IUserRepository } from '../accounts/repositories/IUserRepository';
import { ISessionRepository } from '../accounts/repositories/ISessionRepository';

interface AuthenticateUserUseCaseRequest {
	email: string;
	password: string;
}

type IResponse = Outcome<
	WrongCredentialsError,
	{
		user: User;
	}
>;

@injectable()
export class AuthenticateUserUseCase {
	constructor(
		@inject(containersKeysMap.users_repository) private usersRepository: IUserRepository,
		@inject(containersKeysMap.sessions_repository) private sessionsRepository: ISessionRepository
	) {}

	async execute({ email, password }: AuthenticateUserUseCaseRequest): Promise<IResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			return failure(new WrongCredentialsError());
		}

		if (user.password) {
			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				return failure(new WrongCredentialsError());
			}
		}

		return success({
			user,
		});
	}
}

import { inject, injectable } from 'tsyringe';

import containerKeys from '@/config/container-keys.config';
import { failure, Outcome, success } from '@/core/outcome';
import { User } from '@/domains/main/resources/entities/user';
import { IUserRepository } from '../repositories/IUserRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IUseCaseRequest {
	userId: string;
}

type IUseCaseResponse = Outcome<
	ResourceNotFoundError,
	{
		user: User;
	}
>;

@injectable()
export class GetUserDetailsUseCase {
	constructor(@inject(containerKeys.repositories.users_repository) private usersRepository: IUserRepository) {}

	async execute({ userId }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError());
		}

		return success({
			user,
		});
	}
}

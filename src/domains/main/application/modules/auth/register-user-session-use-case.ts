import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';

import authConfig from '@/config/auth-config';
import containerKeys from '@/config/container-keys.config';
import { failure, Outcome, success } from '@/core/outcome';
import { Session } from '@/domains/main/resources/entities/session';
import { IUserRepository } from '../accounts/repositories/IUserRepository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ISessionRepository } from '../accounts/repositories/ISessionRepository';

interface IRequest {
	userId: string;
	sessionToken: string;
}

type IResponse = Outcome<
	ResourceNotFoundError,
	{
		session: Session;
	}
>;

@injectable()
export class RegisterUserSessionUseCase {
	constructor(
		@inject(containerKeys.repositories.users_repository) private usersRepository: IUserRepository,
		@inject(containerKeys.repositories.sessions_repository) private sessionsRepository: ISessionRepository
	) {}

	async execute({ userId, sessionToken }: IRequest): Promise<IResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError());
		}

		const session = await this.sessionsRepository.findByUserId(userId);

		const tokenExpiresDays = dayjs(new Date()).add(authConfig.tokenExpiresInDaysNumber, 'days').toDate();

		if (!session) {
			const newSession = Session.create({
				sessionToken,
				userId: user.id,
				expiresAt: tokenExpiresDays,
				registerAt: new Date(),
			});

			await this.sessionsRepository.create(newSession);

			return success({ session: newSession });
		}

		session.sessionToken = sessionToken;
		session.expiresAt = tokenExpiresDays;
		session.registerAt = new Date();

		await this.sessionsRepository.update(session);

		return success({ session });
	}
}

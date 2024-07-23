import { container } from 'tsyringe';

import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository';
import { PrismaSessionsRepository } from '@/infra/database/prisma/repositories/prisma-session-repository';

export const containersKeysMap = {
	users_repository: 'UsersRepository',
	sessions_repository: 'SessionsRepository',
};

// Repositories
container.register(containersKeysMap.users_repository, PrismaUsersRepository);
container.register(containersKeysMap.sessions_repository, PrismaSessionsRepository);

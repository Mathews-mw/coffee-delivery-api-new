import { container } from 'tsyringe';
import containerKeys from '@/config/container-keys.config';

import { R2Storage } from '@/infra/storage/r2-storage';
import { PrismaTagsRepository } from '@/infra/database/prisma/repositories/prisma-tags-repository';
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository';
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/prisma-products-repository';
import { PrismaSessionsRepository } from '@/infra/database/prisma/repositories/prisma-sessions-repository';
import { PrismaAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-attachments-repository';
import { PrismaProductsTagsRepository } from '@/infra/database/prisma/repositories/prisma-products-tags-repository';
import { PrismaProductsAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-products-attachments-repository';

// Repositories
container.register(containerKeys.repositories.users_repository, PrismaUsersRepository);
container.register(containerKeys.repositories.sessions_repository, PrismaSessionsRepository);
container.register(containerKeys.repositories.attachments_repository, PrismaAttachmentsRepository);
container.register(containerKeys.repositories.products_repository, PrismaProductsRepository);
container.register(containerKeys.repositories.products_attachments_repository, PrismaProductsAttachmentsRepository);
container.register(containerKeys.repositories.tags_repository, PrismaTagsRepository);
container.register(containerKeys.repositories.products_tags_repository, PrismaProductsTagsRepository);

// Storage
container.register(containerKeys.storage.r2_storage, R2Storage);

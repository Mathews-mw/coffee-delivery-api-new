import { FastifyInstance } from 'fastify';
import { createUserController } from '../controllers/accounts/create-user-controller';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', createUserController);
}

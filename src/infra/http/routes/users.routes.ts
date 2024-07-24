import { FastifyInstance } from 'fastify';
import { createUserController } from '../controllers/accounts/create-user-controller';
import { getUserDetailsController } from '../controllers/accounts/get-user-details-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', createUserController);

	app.get('/me', { preHandler: [authMiddleware] }, getUserDetailsController);
}

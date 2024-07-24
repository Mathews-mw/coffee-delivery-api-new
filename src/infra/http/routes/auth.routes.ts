import { FastifyInstance } from 'fastify';
import { authenticateUserController } from '../controllers/auth/authenticate-user-controller';
import { userRefreshTokenController } from '../controllers/auth/user-refresh-token-controller';

export async function authRoutes(app: FastifyInstance) {
	app.post('/login', authenticateUserController);
	app.patch('/refresh-token', userRefreshTokenController);
}

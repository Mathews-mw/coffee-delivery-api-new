import { FastifyInstance } from 'fastify';
import { authenticateUserController } from '../controllers/auth/authenticate-user-controller';

export async function authRoutes(app: FastifyInstance) {
	app.post('/login', authenticateUserController);
}

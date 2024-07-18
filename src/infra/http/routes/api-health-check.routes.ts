import { FastifyInstance } from 'fastify';

export async function apiHealthCheck(app: FastifyInstance) {
	app.get('/', (_, reply) => {
		try {
			return reply.send({
				status: 'ATIVA',
				message: 'A API do Aplicativo de Manutenções está funcionando normalmente',
			});
		} catch (error) {
			console.log('API Health Check Error: ', error);
			return reply.status(400).send({ message: 'Ocorreu um erro ao tentar verificar a condição da API.' });
		}
	});
}

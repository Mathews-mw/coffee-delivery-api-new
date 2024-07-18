import { app } from './app';
import { env } from './env';

app
	.listen({
		host: env.HOST,
		port: env.PORT,
	})
	.then(() => {
		console.log(`🚀 Server is running. Listening on port ${env.PORT}`);
	});

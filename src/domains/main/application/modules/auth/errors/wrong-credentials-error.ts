export class WrongCredentialsError extends Error {
	constructor() {
		super('Credenciais inválidas. Por favor, verifique sua senha e e-mail.');
	}
}

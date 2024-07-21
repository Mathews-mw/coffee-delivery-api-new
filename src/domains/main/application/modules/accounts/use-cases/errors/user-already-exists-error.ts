export class UserAlreadyExistsError extends Error {
	constructor(userEmail: string) {
		super(`O email ${userEmail} já foi cadastrado. Por favor, escolha outro.`);
	}
}

export class NegativaValueNotAllowedError extends Error {
	constructor() {
		super('Não é permitido valor negativo para o preço do produto.');
	}
}

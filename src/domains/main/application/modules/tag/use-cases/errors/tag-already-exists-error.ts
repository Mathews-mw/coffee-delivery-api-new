export class TagAlreadyExistsError extends Error {
	constructor(tagName: string) {
		super(`Tag com o nome ${tagName} já existe. Por favor, escolha outro nome.`);
	}
}

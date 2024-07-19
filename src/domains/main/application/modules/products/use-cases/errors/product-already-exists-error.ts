export class ProductAlreadyExistsError extends Error {
	constructor(productName: string) {
		super(`Produto com o nome ${productName} já existe. Por favor, escolha outro nome.`);
	}
}

export class CpfAlreadyExistsError extends Error {
	constructor(cpf: string) {
		super(`O cpf ${cpf} já foi cadastrado. Por favor, informe outro.`);
	}
}

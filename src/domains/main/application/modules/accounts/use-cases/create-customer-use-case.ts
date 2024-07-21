import { failure, Outcome, success } from '@/core/outcome';
import { IUserRepository } from '../repositories/IUserRepository';
import { Customer } from '@/domains/main/resources/entities/customer';
import { CpfAlreadyExistsError } from './errors/cpf-already-exists-error';
import { ICustomerRepository } from '../repositories/ICustomerRepository';
import { Registration } from '@/domains/main/resources/entities/registration';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IRegistrationRepository } from '../repositories/IRegistrationRepository';

interface IUseCaseRequest {
	userId: string;
	phoneNumber: string;
	cpf: string;
	street: string;
	number: string;
	complement?: string;
	district: string;
	city: string;
	estate: string;
	cep?: string;
}

type IUseCaseResponse = Outcome<
	CpfAlreadyExistsError | ResourceNotFoundError,
	{
		registration: Registration;
	}
>;

export class CreateCustomerUseCase {
	constructor(
		private usersRepository: IUserRepository,
		private customerRepository: ICustomerRepository,
		private registrationsRepository: IRegistrationRepository
	) {}

	async execute({ userId, phoneNumber, cpf, street, number, complement, district, city, estate, cep }: IUseCaseRequest): Promise<IUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);
		const registrationByCpf = await this.registrationsRepository.findByCpf(cpf);

		if (!user) {
			return failure(new ResourceNotFoundError());
		}

		if (registrationByCpf) {
			return failure(new CpfAlreadyExistsError(cpf));
		}

		const registration = Registration.create({
			phoneNumber,
			cpf,
			street,
			number,
			complement,
			district,
			city,
			estate,
			cep,
		});

		const customer = Customer.create({
			userId: user.id,
			registrationId: registration.id,
		});

		await this.registrationsRepository.create(registration);
		await this.customerRepository.create(customer);

		return success({
			registration,
		});
	}
}

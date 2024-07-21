import { Registration } from '@/domains/main/resources/entities/registration';
import { IRegistrationRepository } from '@/domains/main/application/modules/accounts/repositories/IRegistrationRepository';

export class InMemoryRegistrationsRepository implements IRegistrationRepository {
	public items: Registration[] = [];

	async create(registration: Registration): Promise<Registration> {
		this.items.push(registration);

		return registration;
	}

	async update(registration: Registration): Promise<Registration> {
		const registrationIndex = this.items.findIndex((item) => item.id === registration.id);

		this.items[registrationIndex] = registration;

		return registration;
	}

	async delete(registration: Registration): Promise<void> {
		const registrationIndex = this.items.findIndex((item) => item.id === registration.id);

		this.items.slice(registrationIndex, 1);
	}

	async findById(id: string): Promise<Registration | null> {
		const registration = this.items.find((item) => item.id.toString() === id);

		if (!registration) {
			return null;
		}

		return registration;
	}

	async findByCpf(cpf: string): Promise<Registration | null> {
		const registration = this.items.find((item) => item.cpf === cpf);

		if (!registration) {
			return null;
		}

		return registration;
	}
}

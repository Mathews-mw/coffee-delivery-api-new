import { Registration } from '@/domains/main/resources/entities/registration';

export interface IRegistrationRepository {
	create(registration: Registration): Promise<Registration>;
	update(registration: Registration): Promise<Registration>;
	delete(registration: Registration): Promise<void>;
	findById(id: string): Promise<Registration | null>;
	findByCpf(cpf: string): Promise<Registration | null>;
}

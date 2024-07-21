import { makeUser } from '../factories/make-user';
import { InMemoryUsersRepository } from '../in-memory/in-memory-users-repository';
import { CreateUserUseCase } from '@/domains/main/application/modules/accounts/use-cases/create-user-use-case';
import { UserAlreadyExistsError } from '@/domains/main/application/modules/accounts/use-cases/errors/user-already-exists-error';

let createUserUseCase: CreateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe('Create User Use Case', () => {
	beforeAll(() => {
		userRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(userRepository);
	});

	test('Should be able to create a new user', async () => {
		const result = await createUserUseCase.execute({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password: 'john@Doe#123',
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			user: userRepository.items[0],
		});
	});

	test('Should not be able to create an user with same email', async () => {
		makeUser({
			email: 'johndoe@example.com',
		});

		const result = await createUserUseCase.execute({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password: 'john@Doe#123',
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
	});
});

import { User } from '@/domains/main/resources/entities/user';
import { IUserQuerySearch, IUserRepository, IUserResponse } from '@/domains/main/application/modules/accounts/repositories/IUserRepository';

export class InMemoryUsersRepository implements IUserRepository {
	public items: User[] = [];

	async create(user: User): Promise<User> {
		this.items.push(user);

		return user;
	}

	async update(user: User): Promise<User> {
		const userIndex = this.items.findIndex((item) => item.id === user.id);

		this.items[userIndex] = user;

		return user;
	}

	async delete(user: User): Promise<void> {
		const userIndex = this.items.findIndex((item) => item.id === user.id);

		this.items.slice(userIndex, 1);
	}

	async findAll({ page, perPage, search }: IUserQuerySearch): Promise<IUserResponse> {
		const usersPaginated = this.items
			.filter((item) => (search ? item.name.toLowerCase().includes(search.toLocaleLowerCase()) : item))
			.slice((page - 1) * perPage, page * perPage);

		const totalOccurrences = usersPaginated.length;
		const totalPages = Math.ceil(totalOccurrences / perPage);

		const pagination = {
			page,
			perPage,
			totalPages,
			totalOccurrences,
		};

		return {
			pagination,
			users: usersPaginated,
		};
	}

	async findById(id: string): Promise<User | null> {
		const user = this.items.find((item) => item.id.toString() === id);

		if (!user) {
			return null;
		}

		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.items.find((item) => item.email === email);

		if (!user) {
			return null;
		}

		return user;
	}
}

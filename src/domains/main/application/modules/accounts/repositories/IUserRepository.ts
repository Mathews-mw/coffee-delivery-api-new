import { User } from '@/domains/main/resources/entities/user';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

export interface IQuerySearch extends IPaginationParams {
	search?: string;
}

export interface IUserResponse {
	pagination: IPaginationResponse;
	users: User[];
}

export interface IUserRepository {
	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(user: User): Promise<void>;
	findAll(query: IQuerySearch): Promise<IUserResponse>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
}

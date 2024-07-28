import { User } from '@/domains/main/resources/entities/user';

export class UserPresenter {
	static toHTTP(user: User) {
		return {
			id: user.id.toString(),
			name: user.name,
			email: user.email,
			role: user.role,
			is_active: user.isActive,
		};
	}
}

import { Session } from '@/domains/main/resources/entities/session';
import { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

export interface ISessionRepository {
	create(session: Session): Promise<Session>;
	update(session: Session): Promise<Session>;
	findById(id: string): Promise<Session | null>;
	findByUserId(userId: string): Promise<Session | null>;
}

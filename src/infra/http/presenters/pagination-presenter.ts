import { IPaginationResponse } from '@/core/interfaces/paginating-interfaces';
import { Attachment } from '@/domains/main/resources/entities/attachment';

export class PaginationPresenter {
	static toHTTP(pagination: IPaginationResponse) {
		return {
			page: pagination.page,
			per_page: pagination.perPage,
			total_pages: pagination.totalPages,
			total_occurrences: pagination.totalOccurrences,
		};
	}
}

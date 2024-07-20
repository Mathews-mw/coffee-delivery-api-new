import { WatchedList } from '@/core/entities/watched-list';
import { ProductTag } from './product-tag';

export class ProductTagList extends WatchedList<ProductTag> {
	compareItems(a: ProductTag, b: ProductTag): boolean {
		return a.tagId.equals(b.tagId);
	}
}

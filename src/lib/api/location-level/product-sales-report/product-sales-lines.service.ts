import {Injectable} from '@angular/core'
import {KeyedPaginatedBaseService} from '../../util/keyed-paginated-api/keyed-paginated-base.service'
import {ProductSalesLine} from './product-sales-line.model'
import {ProductSalesLinesParameters} from './product-sales-lines-parameters.model'
import {ProductSalesLinesStore} from './product-sales-lines.store'

@Injectable({providedIn: 'root'})
export class ProductSalesLinesService extends KeyedPaginatedBaseService<ProductSalesLine, ProductSalesLinesParameters> {
  protected override readonly defaultCursor = ''
  protected override readonly urlSuffix = 'lines'

  constructor(protected override readonly store: ProductSalesLinesStore) {
    super(store)
  }
}

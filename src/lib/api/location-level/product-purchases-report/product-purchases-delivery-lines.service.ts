import {Injectable} from '@angular/core'
import {KeyedPaginatedBaseService} from '../../util/keyed-paginated-api/keyed-paginated-base.service'
import {ProductPurchasesDeliveryLine} from './product-purchases-delivery-line.model'
import {ProductPurchasesDeliveryLinesParameters} from './product-purchases-delivery-lines-parameters.model'
import {ProductPurchasesDeliveryLinesStore} from './product-purchases-delivery-lines.store'

@Injectable({providedIn: 'root'})
export class ProductPurchasesDeliveryLinesService
  extends KeyedPaginatedBaseService<ProductPurchasesDeliveryLine, ProductPurchasesDeliveryLinesParameters> {

  protected override readonly defaultCursor = ''
  protected override readonly urlSuffix = 'delivery-lines'

  constructor(protected override readonly store: ProductPurchasesDeliveryLinesStore) {
    super(store)
  }
}

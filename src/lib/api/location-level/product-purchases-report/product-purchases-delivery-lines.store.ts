import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ProductPurchasesDeliveryLine} from './product-purchases-delivery-line.model'

@Injectable({providedIn: 'root'})
export class ProductPurchasesDeliveryLinesStore
  extends createBaseStore<ProductPurchasesDeliveryLine>()
  implements BaseStore<ProductPurchasesDeliveryLine> {

  readonly basePath = 'product-purchases-report'
}

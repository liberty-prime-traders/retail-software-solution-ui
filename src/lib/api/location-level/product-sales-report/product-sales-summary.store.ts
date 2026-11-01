import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ProductSalesSummary} from './product-sales-summary.model'

@Injectable({providedIn: 'root'})
export class ProductSalesSummaryStore
  extends createBaseStore<ProductSalesSummary>(summary => summary.locationProductId)
  implements BaseStore<ProductSalesSummary> {

  readonly basePath = 'sales/product-report'
}

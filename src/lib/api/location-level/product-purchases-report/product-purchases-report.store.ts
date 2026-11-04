import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ProductPurchasesReportRow} from './product-purchases-report-row.model'

@Injectable({providedIn: 'root'})
export class ProductPurchasesReportStore
  extends createBaseStore<ProductPurchasesReportRow>(row => row.locationProductId)
  implements BaseStore<ProductPurchasesReportRow> {

  readonly basePath = 'product-purchases-report'
}

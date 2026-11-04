import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {ProductPurchasesReportParameters} from './product-purchases-report-parameters.model'
import {ProductPurchasesReportRow} from './product-purchases-report-row.model'
import {ProductPurchasesReportStore} from './product-purchases-report.store'

@Injectable({providedIn: 'root'})
export class ProductPurchasesReportService
  extends MultimapBaseService<ProductPurchasesReportRow, ProductPurchasesReportParameters> {

  protected override keyPath: keyof ProductPurchasesReportRow = 'locationProductId'

  constructor(protected override readonly store: ProductPurchasesReportStore) {
    super(store)
  }

  load(parameters: ProductPurchasesReportParameters): Subscription {
    this.invalidateAll()
    return this.postRequest({body: parameters, config: {urlSuffix: 'summary'}})
  }
}

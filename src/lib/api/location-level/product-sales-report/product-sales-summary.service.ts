import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {ProductSalesSummary} from './product-sales-summary.model'
import {ProductSalesSummaryParameters} from './product-sales-summary-parameters.model'
import {ProductSalesSummaryStore} from './product-sales-summary.store'

@Injectable({providedIn: 'root'})
export class ProductSalesSummaryService
  extends MultimapBaseService<ProductSalesSummary, ProductSalesSummaryParameters> {

  protected override keyPath: keyof ProductSalesSummary = 'locationProductId'

  constructor(protected override readonly store: ProductSalesSummaryStore) {
    super(store)
  }

  protected override allowMultipleCalls(): boolean {
    return true
  }

  load(parameters: ProductSalesSummaryParameters): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'summary'})
    return this.post(parameters)
  }
}

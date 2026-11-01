import {computed, Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {ProductSalesReportSearchMetadata} from './product-sales-report-search-metadata.model'
import {ProductSalesReportSearchParameters} from './product-sales-report-search-parameters.model'
import {ProductSalesReportSearchStore} from './product-sales-report-search.store'
import {ProductSalesSummary} from './product-sales-summary.model'

@Injectable({providedIn: 'root'})
export class ProductSalesReportSearchService extends PaginatedBaseService<
  ProductSalesSummary, ProductSalesReportSearchParameters, ProductSalesReportSearchMetadata
> {
  protected override readonly defaultCursor = ''
  protected override readonly urlSuffix = 'search'

  readonly snapshotBuiltAt = computed(() => this.metadata()?.snapshotBuiltAt)

  constructor(protected override readonly store: ProductSalesReportSearchStore) {
    super(store)
  }
}

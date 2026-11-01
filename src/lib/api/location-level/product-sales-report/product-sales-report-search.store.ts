import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {ProductSalesReportSearchParameters} from './product-sales-report-search-parameters.model'
import {ProductSalesSummary} from './product-sales-summary.model'

@Injectable({providedIn: 'root'})
export class ProductSalesReportSearchStore
  extends createPaginatedBaseStore<ProductSalesSummary, ProductSalesReportSearchParameters>()
  implements PaginatedBaseStore<ProductSalesSummary, ProductSalesReportSearchParameters> {

  readonly basePath = 'sales/product-report'
}

import {ProductSalesSortDirection} from './product-sales-sort-direction.enum'
import {ProductSalesSortField} from './product-sales-sort-field.enum'

export interface ProductSalesReportSearchParameters {
  /** Organization-zone calendar days as yyyy-MM-dd, both inclusive. */
  from: string
  to: string
  searchText?: string
  sortField: ProductSalesSortField
  sortDirection: ProductSalesSortDirection
}

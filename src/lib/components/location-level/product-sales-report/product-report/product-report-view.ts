import {
  ProductSalesSortDirection
} from '../../../../api/location-level/product-sales-report/product-sales-sort-direction.enum'
import {
  ProductSalesSortField
} from '../../../../api/location-level/product-sales-report/product-sales-sort-field.enum'
import {ProductSalesSummary} from '../../../../api/location-level/product-sales-report/product-sales-summary.model'

export interface ProductReportSort {
  sortField: ProductSalesSortField
  sortDirection: ProductSalesSortDirection
}

export const DEFAULT_PRODUCT_REPORT_SORT: ProductReportSort = {
  sortField: ProductSalesSortField.NEEDS_ATTENTION,
  sortDirection: ProductSalesSortDirection.DESC
}

/** Mirrors the server's search rule so both sides of the client-side threshold match the same rows. */
export const comparableSearchText = (text: string): string => text.replace(/\s+/g, '').toLowerCase()

export const filterProductReportRows = (rows: ProductSalesSummary[], searchText: string): ProductSalesSummary[] => {
  const comparableSearch = comparableSearchText(searchText)
  if (!comparableSearch) {
    return rows
  }
  return rows.filter(row =>
    comparableSearchText(row.productName).includes(comparableSearch)
    || comparableSearchText(row.productGroupName).includes(comparableSearch)
  )
}

/** First click: names A to Z, numbers largest first. Second reverses. Third restores the default. */
export const nextProductReportSort = (
  current: ProductReportSort,
  clickedField: ProductSalesSortField
): ProductReportSort => {
  const firstDirection = clickedField === ProductSalesSortField.PRODUCT_NAME
    ? ProductSalesSortDirection.ASC
    : ProductSalesSortDirection.DESC
  if (current.sortField !== clickedField) {
    return {sortField: clickedField, sortDirection: firstDirection}
  }
  return current.sortDirection === firstDirection
    ? {sortField: clickedField, sortDirection: reverse(firstDirection)}
    : DEFAULT_PRODUCT_REPORT_SORT
}

const reverse = (sortDirection: ProductSalesSortDirection): ProductSalesSortDirection =>
  sortDirection === ProductSalesSortDirection.ASC ? ProductSalesSortDirection.DESC : ProductSalesSortDirection.ASC

const sortValue = (row: ProductSalesSummary, sortField: ProductSalesSortField): number | string | null => {
  switch (sortField) {
    case ProductSalesSortField.NEEDS_ATTENTION:
      return row.rank
    case ProductSalesSortField.PRODUCT_NAME:
      return row.productName.toLowerCase()
    case ProductSalesSortField.BASE_QUANTITY:
      return row.baseQuantity
    case ProductSalesSortField.NET_SALES:
      return row.netSales
    case ProductSalesSortField.COGS:
      return row.cogs
    case ProductSalesSortField.GROSS_PROFIT:
      return row.grossProfit
    case ProductSalesSortField.MARGIN_PERCENT:
      return row.marginPercent
    case ProductSalesSortField.ADJUSTMENTS_PERCENT:
      return row.adjustmentsPercent
  }
}

const compareValues = (first: number | string, second: number | string): number =>
  typeof first === 'string' ? first.localeCompare(second as string) : first - (second as number)

const compareByNameThenId = (first: ProductSalesSummary, second: ProductSalesSummary): number =>
  first.productName.toLowerCase().localeCompare(second.productName.toLowerCase())
  || first.locationProductId.localeCompare(second.locationProductId)

/**
 * Applies the server's order to rows the server did not page: NEEDS_ATTENTION is the rank, ascending, and any
 * other field puts a null value last in either direction. Ties break on product name, then id, ascending.
 */
export const sortProductReportRows = (
  rows: ProductSalesSummary[],
  {sortField, sortDirection}: ProductReportSort
): ProductSalesSummary[] => {
  const directionFactor = sortDirection === ProductSalesSortDirection.ASC ? 1 : -1
  return [...rows].sort((first, second) => {
    const firstValue = sortValue(first, sortField)
    const secondValue = sortValue(second, sortField)
    if (firstValue === null && secondValue === null) {
      return compareByNameThenId(first, second)
    }
    if (firstValue === null) {
      return 1
    }
    if (secondValue === null) {
      return -1
    }
    const orderFactor = sortField === ProductSalesSortField.NEEDS_ATTENTION ? 1 : directionFactor
    return compareValues(firstValue, secondValue) * orderFactor || compareByNameThenId(first, second)
  })
}

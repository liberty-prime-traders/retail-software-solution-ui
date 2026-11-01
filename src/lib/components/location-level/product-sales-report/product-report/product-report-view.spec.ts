import {
  ProductSalesSortDirection
} from '../../../../api/location-level/product-sales-report/product-sales-sort-direction.enum'
import {
  ProductSalesSortField
} from '../../../../api/location-level/product-sales-report/product-sales-sort-field.enum'
import {ProductSalesSummary} from '../../../../api/location-level/product-sales-report/product-sales-summary.model'
import {
  comparableSearchText,
  DEFAULT_PRODUCT_REPORT_SORT,
  filterProductReportRows,
  nextProductReportSort,
  sortProductReportRows
} from './product-report-view'

const summary = (overrides: Partial<ProductSalesSummary>): ProductSalesSummary => ({
  id: '',
  locationProductId: overrides.productName ?? 'product',
  orgProductId: 'org-product',
  productName: 'Product',
  productGroupName: 'Group',
  baseUnitName: 'Piece',
  lineCount: 1,
  baseQuantity: 1,
  grossSales: 100,
  discountTotal: 0,
  surchargeTotal: 0,
  netSales: 100,
  cogs: 50,
  grossProfit: 50,
  marginPercent: 50,
  marginBeforeAdjustmentsPercent: 50,
  adjustmentsPercent: 0,
  avgListPrice: 100,
  avgSellingPrice: 100,
  avgCost: 50,
  profitPerBaseUnit: 50,
  rank: 1,
  ...overrides
} as ProductSalesSummary)

const names = (rows: ProductSalesSummary[]) => rows.map(row => row.productName)

const sortBy = (sortField: ProductSalesSortField, sortDirection: ProductSalesSortDirection) =>
  ({sortField, sortDirection})

describe('product report view', () => {
  const loss = summary({productName: 'Loss', rank: 1, grossProfit: -10, marginPercent: -10, netSales: 100})
  const discounted = summary({
    productName: 'Discounted', rank: 2, adjustmentsPercent: 20, marginPercent: 5, netSales: 300
  })
  const plain = summary({productName: 'Plain', rank: 3, adjustmentsPercent: 0, marginPercent: 30, netSales: 200})
  const noSales = summary({
    productName: 'No sales', rank: 4, marginPercent: null, adjustmentsPercent: null, netSales: 0
  })
  const rows = [plain, noSales, loss, discounted]

  it('sorts needs attention by rank regardless of direction', () => {
    expect(names(sortProductReportRows(
      rows, sortBy(ProductSalesSortField.NEEDS_ATTENTION, ProductSalesSortDirection.ASC)
    ))).toEqual(['Loss', 'Discounted', 'Plain', 'No sales'])
  })

  it('sorts a metric in the requested direction and keeps null last in both', () => {
    expect(names(sortProductReportRows(
      rows, sortBy(ProductSalesSortField.MARGIN_PERCENT, ProductSalesSortDirection.DESC)
    ))).toEqual(['Plain', 'Discounted', 'Loss', 'No sales'])
    expect(names(sortProductReportRows(
      rows, sortBy(ProductSalesSortField.MARGIN_PERCENT, ProductSalesSortDirection.ASC)
    ))).toEqual(['Loss', 'Discounted', 'Plain', 'No sales'])
  })

  it('sorts by product name ignoring case', () => {
    const lowercase = summary({productName: 'apple'})
    const uppercase = summary({productName: 'Banana'})

    expect(names(sortProductReportRows(
      [uppercase, lowercase], sortBy(ProductSalesSortField.PRODUCT_NAME, ProductSalesSortDirection.ASC)
    ))).toEqual(['apple', 'Banana'])
    expect(names(sortProductReportRows(
      [lowercase, uppercase], sortBy(ProductSalesSortField.PRODUCT_NAME, ProductSalesSortDirection.DESC)
    ))).toEqual(['Banana', 'apple'])
  })

  it('breaks ties on product name and never reorders the input', () => {
    const tiedFirst = summary({productName: 'Tied first', rank: 6, netSales: 10})
    const tiedSecond = summary({productName: 'Tied second', rank: 5, netSales: 10})
    const input = [tiedSecond, tiedFirst]

    expect(names(sortProductReportRows(
      input, sortBy(ProductSalesSortField.NET_SALES, ProductSalesSortDirection.DESC)
    ))).toEqual(['Tied first', 'Tied second'])
    expect(names(input)).toEqual(['Tied second', 'Tied first'])
  })

  it('cycles a numeric column from largest first, to smallest first, back to the default', () => {
    const largestFirst = nextProductReportSort(DEFAULT_PRODUCT_REPORT_SORT, ProductSalesSortField.NET_SALES)
    const smallestFirst = nextProductReportSort(largestFirst, ProductSalesSortField.NET_SALES)

    expect(largestFirst).toEqual(sortBy(ProductSalesSortField.NET_SALES, ProductSalesSortDirection.DESC))
    expect(smallestFirst).toEqual(sortBy(ProductSalesSortField.NET_SALES, ProductSalesSortDirection.ASC))
    expect(nextProductReportSort(smallestFirst, ProductSalesSortField.NET_SALES)).toEqual(DEFAULT_PRODUCT_REPORT_SORT)
  })

  it('starts the name column at A to Z and switching columns restarts the cycle', () => {
    const byName = nextProductReportSort(DEFAULT_PRODUCT_REPORT_SORT, ProductSalesSortField.PRODUCT_NAME)

    expect(byName).toEqual(sortBy(ProductSalesSortField.PRODUCT_NAME, ProductSalesSortDirection.ASC))
    expect(nextProductReportSort(byName, ProductSalesSortField.COGS))
      .toEqual(sortBy(ProductSalesSortField.COGS, ProductSalesSortDirection.DESC))
  })

  it('ignores case and all whitespace when searching name or group', () => {
    const riceBag = summary({productName: 'Rice  Bag 5kg', productGroupName: 'Flour and grains'})

    expect(comparableSearchText(' RICE bag5 ')).toBe('ricebag5')
    expect(filterProductReportRows([riceBag, plain], ' RICE bag5 ')).toEqual([riceBag])
    expect(filterProductReportRows([riceBag, plain], 'FLOURand')).toEqual([riceBag])
  })

  it('returns every row for a blank search', () => {
    expect(filterProductReportRows(rows, '   ')).toEqual(rows)
  })
})

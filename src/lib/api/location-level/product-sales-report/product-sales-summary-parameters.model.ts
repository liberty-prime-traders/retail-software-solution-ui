/** `from` is inclusive and `before` exclusive, both as offset date-times. One to four distinct products. */
export interface ProductSalesSummaryParameters {
  locationProductIds: string[]
  from: string
  before: string
}

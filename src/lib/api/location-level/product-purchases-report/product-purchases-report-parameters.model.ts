/** `deliveredFrom` is inclusive and `deliveredBefore` exclusive, both as offset date-times. */
export interface ProductPurchasesReportParameters {
  deliveredFrom: string
  deliveredBefore: string
  locationProductIds: string[]
  categoryIds: string[]
  supplierIds: string[]
}

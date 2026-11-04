/** The product is the key in the URL path. `deliveredFrom` is inclusive and `deliveredBefore` exclusive. */
export interface ProductPurchasesDeliveryLinesParameters {
  deliveredFrom: string
  deliveredBefore: string
  supplierIds: string[]
}

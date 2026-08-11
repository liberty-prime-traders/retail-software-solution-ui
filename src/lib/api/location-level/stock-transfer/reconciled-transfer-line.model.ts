export interface ReconciledTransferLine {
  dispatchLineRef: string
  productLabel: string
  quantity: number
  unitId: string
  baseUnitId: string
  conversionFactor: number
  unitCost?: number
  quantityReceived?: number
  totalCost: number
}

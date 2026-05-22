export interface ConversionContext {
  sourceUnitId: string
  targetUnitId: string
  value: number
  conversionFactor: number
  snapshotUnitId?: string
}

export interface HasUnitFields {
  unitId: string
  baseUnitId: string
  conversionFactor: number
  snapshotUnitId?: string
}

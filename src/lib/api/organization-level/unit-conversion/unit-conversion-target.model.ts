export interface UnitConversionTarget {
  id: string,
  name: string,
  code: string,
  factor: number
}

export type UnitConversionGraph = Map<string, Map<string, UnitConversionTarget>>

import {TaxSourceType} from './tax-source-type.enum'

export interface TaxEntrySearchParameters {
  fiscalPeriodIds?: string[]
  taxTypeIds?: string[]
  sourceTypes?: TaxSourceType[]
  sourceReferenceNumbers?: string[]
  minTaxAmount?: number
  maxTaxAmount?: number
}

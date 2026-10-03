import {BaseModel} from '../../util/base-api/base.model'

export interface TaxTypePeriodSummary {
  fiscalPeriodId: string
  fiscalPeriodName: string
  taxTypeId: string
  taxTypeName: string
  entryCount: number
  grossTaxable: number
  grossTax: number
  reversalTax: number
  netTax: number
}

export interface TaxEntrySearchSummary extends BaseModel {
  groups: TaxTypePeriodSummary[]
  grossTax: number
  reversalTax: number
  netTax: number
  entryCount: number
}

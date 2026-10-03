import {CalculationMethod} from '../../platform-level/tax-type/calculation-method.enum'
import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {TaxDirection} from './tax-direction.enum'
import {TaxSourceType} from './tax-source-type.enum'

export interface TaxEntrySearchResult extends PaginatedModel {
  sourceReferenceNumber: string
  sourceType: TaxSourceType
  direction: TaxDirection
  taxTypeId: string
  taxTypeName: string
  fiscalPeriodId: string
  fiscalPeriodName: string
  calculationMethod: CalculationMethod
  rate: number
  taxInclusive: boolean
  taxableAmount: number
  taxAmount: number
  recordedOn: string
}

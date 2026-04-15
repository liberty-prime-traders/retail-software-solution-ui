import {BaseModel} from '../../util/base-api/base.model'

export interface FiscalPeriod extends BaseModel {
  name: string
  startDate: string
  endDate: string
  closable: boolean
  yearEnd: boolean
  fiscalYear: string
  stub: boolean
  closedAt?: string
  closedBy?: string
}

import {BaseModel} from '../../util/base-api/base.model'

export interface SaleSessionSummary extends BaseModel {
  createdBy: string,
  createdAt: string,
  lastUpdatedAt: string,
  lastAccessedBy: string,
  lastAccessedAt: string,
  contactLabel: string,
  payableTotal: number
  notes?: string
}

import {BaseModel} from '../../util/base-api/base.model'
import {ContactSubledgerDirection} from '../contact-opening-balance/contact-subledger-direction.enum'

export interface ContactOpeningSettlementVoid {
  voidDate: string
  reason?: string
  voidedBy: string
}

export interface ContactOpeningSettlement {
  id: string
  referenceNumber: string
  subledgerDirection: ContactSubledgerDirection
  paymentAccountCode: string
  paymentAccountLabel: string
  amount: number
  settlementDate: string
  note?: string
  recordedAt: string
  recordedBy: string
  void?: ContactOpeningSettlementVoid
}

export interface ContactOpeningSettlementSummary extends BaseModel {
  contactReferenceNumber: string
  receivableOutstanding: number
  payableOutstanding: number
  settlements: ContactOpeningSettlement[]
}

export interface ContactOpeningSettlementCreateRequest {
  contactId: string
  subledgerDirection: ContactSubledgerDirection
  paymentMethodId: string
  amount: number
  settlementDate: string
  note?: string
}

export interface ContactOpeningSettlementVoidRequest {
  settlementId: string
  reason?: string
}

export type ContactOpeningSettlementRequest =
  ContactOpeningSettlementCreateRequest
  | ContactOpeningSettlementVoidRequest

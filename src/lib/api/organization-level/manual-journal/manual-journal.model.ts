import {AccountType} from '../chart-of-accounts/account-type.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {ManualJournalEntryType} from './manual-journal-entry-type.enum'

export interface ManualJournalLine {
  referenceNumber: string
  accountCode: string
  accountName: string
  accountType: AccountType
  entryType: ManualJournalEntryType
  amount: number
  lineMemo?: string
}

export interface ManualJournal extends BaseModel {
  referenceNumber: string
  summary: string
  details?: string
  postingDate: string
  reversalOfReferenceNumber?: string
  reversedByReferenceNumber?: string
  lines: ManualJournalLine[]
  postedBy: string
  postedOn: string
}

export interface ManualJournalLineRequest {
  accountCode: string
  entryType: ManualJournalEntryType
  amount: number
  lineMemo?: string
}

export interface ManualJournalCreateRequest {
  summary: string
  details?: string
  postingDate?: string
  lines: ManualJournalLineRequest[]
}

export interface ManualJournalReversalRequest {
  reason: string
}

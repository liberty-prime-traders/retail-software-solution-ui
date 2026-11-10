import {BalanceEffect} from '../../organization-level/chart-of-accounts/balance-effect.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {RevisionPreviewSeverity} from './revision-preview-severity.enum'

export interface RevisionPreviewItem {
  severity: RevisionPreviewSeverity
  documentReference: string
  description: string
  effect: string
  netProfitChange?: number
}

export interface RevisionPreviewLedgerLine {
  accountText: string
  debit?: number
  credit?: number
  balanceEffect: BalanceEffect
}

export interface RevisionPreviewLedgerEntry {
  source: string
  description: string
  lines: RevisionPreviewLedgerLine[]
}

export interface TextSegment {
  text: string
  emphasis: boolean
}

export interface GuidanceParagraph {
  segments: TextSegment[]
}

export interface DeliveryLineRevisionPreview extends BaseModel {
  revisedDeliveryLineReferenceNumber: string
  changeSummary: string
  transactions: RevisionPreviewItem[]
  guidance: GuidanceParagraph[]
  ledgerEntries: RevisionPreviewLedgerEntry[]
  blocksSaveCount: number
  warningCount: number
  blocksSave: boolean
}

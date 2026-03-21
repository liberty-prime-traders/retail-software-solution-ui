import {SyncStatus} from './sync-status.enum'
import {BaseModel} from '../../util/base-api/base.model'

export enum TableName {
  PRODUCT = 'PRODUCT'
}

export enum SyncMode {
  FULL = 'FULL',
  INCREMENTAL = 'INCREMENTAL'
}

export interface SyncLog extends BaseModel {
  tableName: TableName
  syncMode: SyncMode
  status: SyncStatus
  totalRecords?: number
  processedRecords: number
  skippedRecords: number
  failedRecords: number
  percentComplete?: number
  lastProcessedRevision?: number
  createdOn?: string
  startedAt?: string
  completedAt?: string
  canceledAt?: string
  errorMessage?: string
}

export interface SyncRequest {
  tableName: TableName
  syncMode: SyncMode
}

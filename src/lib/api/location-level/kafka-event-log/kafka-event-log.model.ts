import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../util/base-api/base.model'

export enum EventProcessingLogStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
  PUBLISH_FAILED = 'PUBLISH_FAILED'
}

export interface KafkaEventLog extends BaseModel {
  sourceDocumentId: EntityId
  processor: string | null
  status: EventProcessingLogStatus
  processedOn: string | null
  failureReason: string | null
}

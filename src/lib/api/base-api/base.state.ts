import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseModel} from './base.model'
import {EntityState} from '@datorama/akita'

export interface BaseState<E extends BaseModel> extends EntityState<E, string> {
  processingStatus?: ProcessingStatus
  failureMessages: string[]
  loading: boolean
}

export const createInitialState = <MODEL extends BaseModel>(): BaseState<MODEL> => ({
    processingStatus: ProcessingStatus.IDLE,
    loading: false,
    failureMessages: []
})

import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseModel} from './base.model'
import {EntityState} from '@datorama/akita'

export interface BaseState<E extends BaseModel> extends EntityState<E, string> {
  saveStatus: ProcessingStatus
  deleteStatus: ProcessingStatus
  fetchStatus?: ProcessingStatus
  failureMessages: string[]
  loading: boolean
}

export const createInitialState = <MODEL extends BaseModel>(): BaseState<MODEL> => ({
    saveStatus: ProcessingStatus.IDLE,
    deleteStatus: ProcessingStatus.IDLE,
    fetchStatus: ProcessingStatus.IDLE,
    loading: false,
    failureMessages: []
})

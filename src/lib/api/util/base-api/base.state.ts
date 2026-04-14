import {ProcessingStatus} from '../../../utils/types/processing-status.enum'

export interface BaseState {
  processingStatus: ProcessingStatus
  failureMessages: string[]
  errorBody: unknown
  loading: boolean
  hasCache: boolean
}

export const createInitialState = (): BaseState => ({
  processingStatus: ProcessingStatus.IDLE,
  loading: false,
  failureMessages: [],
  hasCache: false,
  errorBody: {}
})

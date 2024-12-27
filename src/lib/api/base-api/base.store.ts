import {action, EntityStore} from '@datorama/akita'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseModel} from './base.model'
import {BaseState} from './base.state'

export abstract class BaseStore<E extends BaseModel, S extends BaseState<E>> extends EntityStore<S, E, string> {
    protected constructor(protected initialState: S) {
        super({...initialState})
    }

  @action('set processing status')
  setProcessingStatus(processingStatus: ProcessingStatus) {
    const partial: Partial<S> = {}
    this.update({...partial, processingStatus})
  }
  
  @action('set error')
  override setError<T>(error: T) {
    const partial: Partial<S> = {}
    this.update({...partial, failureMessages: this.parseError(error)})
  }
  
  parseError(error: any): string[] {
    if (error === null || error.status !== 400) {
      return ['Unknown Error, Contact Admin']
    }
    let err = []
    if (error.status === 400) {
      if (typeof error.error === 'string') {
        err = [error.error]
      } else if (error.error instanceof Array) {
        err = error
      } else if ('message' in error.error) {
        err = [error.error['message']]
      }
    }
    return err
  }
}

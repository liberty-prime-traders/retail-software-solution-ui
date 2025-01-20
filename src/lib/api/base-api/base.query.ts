import {EntityStore, QueryEntity} from '@datorama/akita'
import {Observable} from 'rxjs'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseModel} from './base.model'
import {BaseState} from './base.state'

export abstract class BaseQuery<E extends BaseModel, STATE extends BaseState<E>> extends QueryEntity<STATE, E, string> {
  
  protected constructor(protected override readonly store: EntityStore<STATE>) {
    super(store)
  }

  selectProcessingStatus(): Observable<ProcessingStatus|undefined> {
    return this.select((state) => state.processingStatus)
  }

  selectFailureMessages(): Observable<string[]> {
    return this.select((state) => state.failureMessages)
  }
}

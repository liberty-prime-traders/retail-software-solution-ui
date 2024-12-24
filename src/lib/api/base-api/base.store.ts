import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseState} from './base.state'
import {BaseModel} from './base.model'
import {action, EntityStore} from '@datorama/akita'

export abstract class BaseStore<E extends BaseModel, S extends BaseState<E>> extends EntityStore<S, E, string> {
    protected constructor(protected initialState: S) {
        super({...initialState})
    }

  @action('set save status')
    setSaveStatus(saveStatus: ProcessingStatus) {
        const partial: Partial<S> = {}
        this.update({...partial, saveStatus})
    }

  @action('set delete status')
  setDeleteStatus(deleteStatus: ProcessingStatus) {
      const partial: Partial<S> = {}
      this.update({...partial, deleteStatus})
  }

  @action('set fetch status')
  setFetchStatus(fetchStatus: ProcessingStatus) {
      const partial: Partial<S> = {}
      this.update({...partial, fetchStatus})
  }
}

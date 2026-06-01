import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {UnsavedCartsSummary} from './unsaved-carts-summary.model'
import {UnsavedCartsSummaryStore} from './unsaved-carts-summary.store'


@Injectable({providedIn: 'root'})
export class UnsavedCartsSummaryService extends BaseService<UnsavedCartsSummary> {

  constructor(protected override readonly store: UnsavedCartsSummaryStore) {
    super(store)
  }

  override getHttpParams(): HttpParams {
    return new HttpParams().set('mineOnly', true)
  }

  getMySessions(callbacks?: ApiCallbacks<UnsavedCartsSummary>) {
    return this.refetchRequest({callbacks})
  }

  abandonSession(sessionId: string, callbacks?: ApiCallbacks<UnsavedCartsSummary>) {
    return this.deleteRequest({id: sessionId, callbacks})
  }
}

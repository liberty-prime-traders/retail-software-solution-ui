import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {SaleSessionSummary} from './sale-session-summary.model'
import {SaleSessionSummaryStore} from './sale-session-summary.store'


@Injectable({providedIn: 'root'})
export class SaleSessionSummaryService extends BaseService<SaleSessionSummary> {

  constructor(protected override readonly store: SaleSessionSummaryStore) {
    super(store)
  }

  override getHttpParams(): HttpParams {
    return new HttpParams().set('mineOnly', true)
  }

  getMySessions() {
    return this.refetchRequest({})
  }
}

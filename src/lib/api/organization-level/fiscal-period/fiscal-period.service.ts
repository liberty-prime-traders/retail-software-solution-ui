import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {FiscalPeriod} from './fiscal-period.model'
import {FiscalPeriodStore} from './fiscal-period.store'

@Injectable({providedIn: 'root'})
export class FiscalPeriodService extends BaseService<FiscalPeriod> {
  constructor(protected override readonly store: FiscalPeriodStore) {
    super(store)
  }

  rename(body: Pick<FiscalPeriod, 'id' | 'name'>, callbacks?: ApiCallbacks<FiscalPeriod>) {
    this.putRequest({body: body as Partial<FiscalPeriod>, callbacks, config: {urlSuffix: 'rename'}})
  }

  close(ids: EntityId[], callbacks?: ApiCallbacks<FiscalPeriod>) {
    this.postRequest({body: ids as any, callbacks, config: {urlSuffix: 'close', upsertOnSuccess: true}})
  }

  yearEndClose(id: EntityId, callbacks?: ApiCallbacks<FiscalPeriod>) {
    this.postRequest({callbacks, id, config: {urlSuffix: 'year-end-close'}})
  }

  nudge(callbacks?: ApiCallbacks<FiscalPeriod>) {
    this.postRequest({callbacks, config: {urlSuffix: 'nudge'}})
  }
}

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
    this.patchApiRequestConfig({urlSuffix: 'rename'})
    this.put(body as Partial<FiscalPeriod>, callbacks)
  }

  close(ids: EntityId[], callbacks?: ApiCallbacks<FiscalPeriod>) {
    this.patchApiRequestConfig({urlSuffix: 'close', upsertOnSuccess: true})
    this.post(ids as any, callbacks)
  }

  yearEndClose(id: EntityId, callbacks?: ApiCallbacks<FiscalPeriod>) {
    this.patchApiRequestConfig({urlSuffix: 'year-end-close'})
    this.post(undefined, callbacks, id)
  }

  nudge(callbacks?: ApiCallbacks<FiscalPeriod>) {
    this.patchApiRequestConfig({urlSuffix: 'nudge'})
    this.post(undefined, callbacks)
  }
}

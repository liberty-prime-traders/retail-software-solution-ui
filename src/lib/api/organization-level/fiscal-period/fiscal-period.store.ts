import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {FiscalPeriod} from './fiscal-period.model'

@Injectable({providedIn: 'root'})
export class FiscalPeriodStore extends createBaseStore<FiscalPeriod>() implements BaseStore<FiscalPeriod> {
  readonly basePath = 'fiscal-periods'
}

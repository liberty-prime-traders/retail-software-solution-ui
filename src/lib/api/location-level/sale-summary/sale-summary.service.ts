import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {SaleSummary} from './sale-summary.model'
import {SaleSummaryStore} from './sale-summary.store'

@Injectable({providedIn: 'root'})
export class SaleSummaryService extends BaseService<SaleSummary> {

  constructor(protected override readonly store: SaleSummaryStore) {
    super(store)
  }

}

import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {TaxRate} from './tax-rate.model'
import {TaxRateStore} from './tax-rate.store'

@Injectable({providedIn: 'root'})
export class TaxRateService extends BaseService<TaxRate> {

  constructor(protected override readonly store: TaxRateStore) {
    super(store)
  }
}

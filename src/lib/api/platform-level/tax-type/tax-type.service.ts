import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {TaxType} from './tax-type.model'
import {TaxTypeStore} from './tax-type.store'

@Injectable({providedIn: 'root'})
export class TaxTypeService extends BaseService<TaxType> {

  constructor(protected override readonly store: TaxTypeStore) {
    super(store)
  }
}

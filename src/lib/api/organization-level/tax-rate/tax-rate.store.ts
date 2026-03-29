import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {TaxRate} from './tax-rate.model'

@Injectable({providedIn: 'root'})
export class TaxRateStore extends createBaseStore<TaxRate>() implements BaseStore<TaxRate> {
  readonly basePath = 'tax-rates'
}

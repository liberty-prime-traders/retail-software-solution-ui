import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {TaxType} from './tax-type.model'

@Injectable({providedIn: 'root'})
export class TaxTypeStore extends createBaseStore<TaxType>() implements BaseStore<TaxType> {
  readonly basePath = 'tax-types'
}

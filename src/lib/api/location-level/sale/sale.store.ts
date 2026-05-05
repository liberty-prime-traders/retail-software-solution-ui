import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Sale} from './sale.model'

@Injectable({providedIn: 'root'})
export class SaleStore extends createBaseStore<Sale>()
  implements BaseStore<Sale> {
  readonly basePath = 'sales'
}

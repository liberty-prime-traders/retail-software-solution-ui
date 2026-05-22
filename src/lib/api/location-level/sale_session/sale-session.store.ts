import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SaleSession} from './sale-session.model'

@Injectable({providedIn: 'root'})
export class SaleSessionStore extends createBaseStore<SaleSession>()
  implements BaseStore<SaleSession> {
  readonly basePath = 'sale-sessions'
}

import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {OpeningBalanceRevision} from './opening-balance-revision.model'

@Injectable({providedIn: 'root'})
export class OpeningBalanceRevisionStore
  extends createBaseStore<OpeningBalanceRevision>((entity) => entity.referenceNumber!)
  implements BaseStore<OpeningBalanceRevision> {
  readonly basePath = 'opening-balances'
}

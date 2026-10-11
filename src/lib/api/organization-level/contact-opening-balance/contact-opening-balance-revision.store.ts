import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ContactOpeningBalanceRevision} from './contact-opening-balance-revision.model'

@Injectable({providedIn: 'root'})
export class ContactOpeningBalanceRevisionStore
  extends createBaseStore<ContactOpeningBalanceRevision>((entity) => entity.referenceNumber!)
  implements BaseStore<ContactOpeningBalanceRevision> {
  readonly basePath = 'contact-opening-balances'
}

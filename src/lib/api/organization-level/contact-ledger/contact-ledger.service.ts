import {Injectable} from '@angular/core'
import {KeyedPaginatedBaseService} from '../../util/keyed-paginated-api/keyed-paginated-base.service'
import {ContactLedgerEntry} from './contact-ledger-entry.model'
import {ContactLedgerSearchParameters} from './contact-ledger-search-parameters.model'
import {ContactLedgerStore} from './contact-ledger.store'

@Injectable({providedIn: 'root'})
export class ContactLedgerService extends KeyedPaginatedBaseService<ContactLedgerEntry, ContactLedgerSearchParameters> {
  protected override readonly defaultCursor = ''
  protected override readonly urlSuffix = 'ledger'

  constructor(protected override readonly store: ContactLedgerStore) {
    super(store)
  }
}

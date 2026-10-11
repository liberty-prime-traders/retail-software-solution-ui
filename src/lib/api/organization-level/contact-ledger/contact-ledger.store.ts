import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ContactLedgerEntry} from './contact-ledger-entry.model'

@Injectable({providedIn: 'root'})
export class ContactLedgerStore extends createBaseStore<ContactLedgerEntry>() implements BaseStore<ContactLedgerEntry> {
  readonly basePath = 'contacts'
}

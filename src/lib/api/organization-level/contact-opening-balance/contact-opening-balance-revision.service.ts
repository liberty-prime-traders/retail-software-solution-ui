import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {ContactOpeningBalanceRevision} from './contact-opening-balance-revision.model'
import {ContactOpeningBalanceRevisionStore} from './contact-opening-balance-revision.store'
import {ContactOpeningBalance} from './contact-opening-balance.model'

@Injectable({providedIn: 'root'})
export class ContactOpeningBalanceRevisionService
  extends MultimapBaseService<ContactOpeningBalanceRevision, ContactOpeningBalance> {

  protected override keyPath: keyof ContactOpeningBalanceRevision = 'contactReferenceNumber'

  constructor(protected override readonly store: ContactOpeningBalanceRevisionStore) {
    super(store)
  }

  getHistory(contactReferenceNumber: EntityId | undefined) {
    this.patchApiRequestConfig({urlSuffix: `history`})
    return this.refetch(contactReferenceNumber)
  }

  setOpeningBalance(
    contactId: EntityId,
    openingBalance: ContactOpeningBalance,
    callbacks: ApiCallbacks<ContactOpeningBalanceRevision>
  ) {
    this.patchApiRequestConfig({urlSuffix: ''})
    return this.postRequest({id: contactId, body: openingBalance, callbacks})
  }
}

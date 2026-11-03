import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {
  ManualJournal,
  ManualJournalCreateRequest,
  ManualJournalReversalRequest
} from './manual-journal.model'
import {ManualJournalStore} from './manual-journal.store'

@Injectable({providedIn: 'root'})
export class ManualJournalService extends BaseService<ManualJournal, ManualJournalCreateRequest | ManualJournalReversalRequest> {
  constructor(protected override readonly store: ManualJournalStore) {
    super(store)
  }

  createManualJournal(request: ManualJournalCreateRequest, callbacks?: ApiCallbacks<ManualJournal>) {
    this.patchApiRequestConfig({upsertOnSuccess: true})
    return this.post(request, callbacks)
  }

  reverseManualJournal(referenceNumber: string, reason: string, callbacks?: ApiCallbacks<ManualJournal>) {
    this.patchApiRequestConfig({urlSuffix: 'reversal', upsertOnSuccess: true})
    return this.post({reason}, callbacks, referenceNumber)
  }
}

import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ContactOpeningSettlementSummary} from './contact-opening-settlement.model'

@Injectable({providedIn: 'root'})
export class ContactOpeningSettlementStore
  extends createBaseStore<ContactOpeningSettlementSummary>((entity) => entity.contactReferenceNumber)
  implements BaseStore<ContactOpeningSettlementSummary> {
  readonly basePath = 'contact-opening-settlements'
}

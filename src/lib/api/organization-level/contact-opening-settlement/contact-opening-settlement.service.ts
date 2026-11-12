import {computed, Injectable, Signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {
  ContactOpeningSettlement,
  ContactOpeningSettlementCreateRequest,
  ContactOpeningSettlementRequest,
  ContactOpeningSettlementSummary,
  ContactOpeningSettlementVoidRequest
} from './contact-opening-settlement.model'
import {ContactOpeningSettlementStore} from './contact-opening-settlement.store'

export interface ContactOpeningSettlementFigures {
  settlements: Signal<ContactOpeningSettlement[]>
  receivableOutstanding: Signal<number>
  payableOutstanding: Signal<number>
  netOutstanding: Signal<number>
  hasOutstanding: Signal<boolean>
}

@Injectable({providedIn: 'root'})
export class ContactOpeningSettlementService
  extends MultimapBaseService<ContactOpeningSettlementSummary, ContactOpeningSettlementRequest> {

  protected override keyPath: keyof ContactOpeningSettlementSummary = 'contactReferenceNumber'

  constructor(protected override readonly store: ContactOpeningSettlementStore) {
    super(store)
  }

  selectFigures(contactReferenceNumber: Signal<EntityId | undefined>): ContactOpeningSettlementFigures {
    const summaries = this.selectForGroup(contactReferenceNumber)
    const summary = computed(() => summaries()[0])
    const receivableOutstanding = computed(() => summary()?.receivableOutstanding ?? 0)
    const payableOutstanding = computed(() => summary()?.payableOutstanding ?? 0)
    return {
      settlements: computed(() => summary()?.settlements ?? []),
      receivableOutstanding,
      payableOutstanding,
      netOutstanding: computed(() => Math.round((receivableOutstanding() - payableOutstanding()) * 100) / 100),
      hasOutstanding: computed(() => receivableOutstanding() > 0 || payableOutstanding() > 0)
    }
  }

  getSummary(contactReferenceNumber: EntityId | undefined) {
    return this.refetch(contactReferenceNumber)
  }

  recordSettlement(
    request: ContactOpeningSettlementCreateRequest,
    callbacks?: ApiCallbacks<ContactOpeningSettlementSummary>
  ) {
    return this.postRequest({body: request, callbacks})
  }

  voidSettlement(
    request: ContactOpeningSettlementVoidRequest,
    callbacks?: ApiCallbacks<ContactOpeningSettlementSummary>
  ) {
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'void'}})
  }
}

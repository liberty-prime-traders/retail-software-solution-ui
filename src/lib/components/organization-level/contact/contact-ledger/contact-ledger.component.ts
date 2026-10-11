import {DatePipe} from '@angular/common'
import {Component, effect, inject, input, untracked, viewChild} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {ContactLedgerService} from '../../../../api/organization-level/contact-ledger/contact-ledger.service'
import {loadNextForKeyOnLazyLoad} from '../../../../api/util/keyed-paginated-api/keyed-paginated-lazy-load.util'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {resetVirtualScrollOnSearch} from '../../../../utils/primeng-table.util'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {MoneyComponent} from '../../../reusable/money.component'

@Component({
  selector: 'rts-contact-ledger',
  templateUrl: 'contact-ledger.component.html',
  imports: [
    TableModule,
    Skeleton,
    DatePipe,
    PrettifyEnumPipe,
    EmptyRowComponent,
    AutoStretchDirective,
    MoneyComponent
  ]
})
export class ContactLedgerComponent {
  private readonly ledgerService = inject(ContactLedgerService)
  private readonly table = viewChild(Table)

  readonly contactId = input.required<EntityId>()

  readonly entries = this.ledgerService.selectForKey(this.contactId)
  readonly loading = this.ledgerService.selectLoadingForKey(this.contactId)

  readonly $loadForContact = effect(() => {
    const contactId = this.contactId()
    untracked(() => this.ledgerService.ensureLoaded(contactId, {}))
  })

  readonly $resetScrollOnContactChange = effect(() => {
    this.contactId()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextForKeyOnLazyLoad(this.ledgerService, this.contactId(), lazyLoadEvent.last)
  }
}

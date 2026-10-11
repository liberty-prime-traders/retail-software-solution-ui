import {DatePipe} from '@angular/common'
import {Component, effect, inject, input, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {TableModule} from 'primeng/table'
import {
  ContactOpeningBalanceRevisionService
} from '../../../../api/organization-level/contact-opening-balance/contact-opening-balance-revision.service'
import {
  ContactSubledgerDirectionLabelPipe
} from '../../../../api/organization-level/contact-opening-balance/contact-subledger-direction-label.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {MoneyComponent} from '../../../reusable/money.component'

@Component({
  selector: 'rts-contact-opening-balance-history',
  templateUrl: 'contact-opening-balance-history.component.html',
  imports: [
    TableModule,
    EmptyRowComponent,
    DatePipe,
    MoneyComponent,
    AutoStretchDirective,
    ContactSubledgerDirectionLabelPipe
  ]
})
export class ContactOpeningBalanceHistoryComponent {
  private readonly revisionService = inject(ContactOpeningBalanceRevisionService)

  readonly contactReferenceNumber = input.required<EntityId | undefined>()

  readonly revisions = this.revisionService.selectForGroup(this.contactReferenceNumber)
  readonly loading = this.revisionService.selectLoading

  private readonly refetchHistory = effect(() => {
    const contactReferenceNumber = this.contactReferenceNumber()
    untracked(() => this.revisionService.getHistory(contactReferenceNumber))
  })
}

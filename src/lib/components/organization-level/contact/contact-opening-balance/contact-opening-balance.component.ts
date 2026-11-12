import {CurrencyPipe} from '@angular/common'
import {Component, computed, effect, inject, input, signal, untracked} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {Panel} from 'primeng/panel'
import {
  ContactOpeningSettlementService
} from '../../../../api/organization-level/contact-opening-settlement/contact-opening-settlement.service'
import {Contact} from '../../../../api/organization-level/contact/contact.model'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {MoneyComponent} from '../../../reusable/money.component'
import {
  ContactOpeningBalanceEditComponent
} from './contact-opening-balance-edit/contact-opening-balance-edit.component'
import {
  ContactOpeningBalanceHistoryComponent
} from './contact-opening-balance-history/contact-opening-balance-history.component'
import {
  ContactOpeningSettlementGridComponent
} from './contact-opening-settlement-grid/contact-opening-settlement-grid.component'

@Component({
  selector: 'rts-contact-opening-balance',
  templateUrl: 'contact-opening-balance.component.html',
  imports: [
    ButtonDirective,
    Dialog,
    Panel,
    FormFieldComponent,
    MoneyComponent,
    ContactOpeningBalanceEditComponent,
    ContactOpeningBalanceHistoryComponent,
    ContactOpeningSettlementGridComponent,
    CurrencyPipe
  ]
})
export class ContactOpeningBalanceComponent {
  private readonly contactOpeningSettlementService = inject(ContactOpeningSettlementService)

  readonly contact = input.required<Contact>()

  readonly figures = this.contactOpeningSettlementService.selectFigures(
    computed(() => this.contact().referenceNumber)
  )
  readonly netOutstanding = this.figures.netOutstanding

  readonly showEditDialog = signal(false)

  private readonly fetchSummary = effect(() => {
    const contactReferenceNumber = this.contact().referenceNumber
    untracked(() => this.contactOpeningSettlementService.getSummary(contactReferenceNumber))
  })
}

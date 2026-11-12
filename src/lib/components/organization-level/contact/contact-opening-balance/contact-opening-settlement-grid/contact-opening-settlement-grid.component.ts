import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, inject, input, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Panel} from 'primeng/panel'
import {TableModule} from 'primeng/table'
import {
  ContactSubledgerDirectionLabelPipe
} from '../../../../../api/organization-level/contact-opening-balance/contact-subledger-direction-label.pipe'
import {
  ContactOpeningSettlementFigures,
  ContactOpeningSettlementService
} from '../../../../../api/organization-level/contact-opening-settlement/contact-opening-settlement.service'
import {Contact} from '../../../../../api/organization-level/contact/contact.model'
import {ContactService} from '../../../../../api/organization-level/contact/contact.service'
import {NullSafePipe} from '../../../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../../../reusable/empty-row/empty-row.component'
import {ContactOpeningSettlementFormComponent} from '../contact-opening-settlement-form/contact-opening-settlement-form.component'
import {
  ContactOpeningSettlementVoidFormComponent
} from '../contact-opening-settlement-void-form/contact-opening-settlement-void-form.component'

@Component({
  selector: 'rts-contact-opening-settlement-grid',
  templateUrl: 'contact-opening-settlement-grid.component.html',
  imports: [
    TableModule,
    ButtonDirective,
    Panel,
    NgClass,
    CurrencyPipe,
    NullSafePipe,
    EmptyRowComponent,
    ContactSubledgerDirectionLabelPipe,
    ContactOpeningSettlementFormComponent,
    ContactOpeningSettlementVoidFormComponent
  ]
})
export class ContactOpeningSettlementGridComponent {
  private readonly contactOpeningSettlementService = inject(ContactOpeningSettlementService)
  private readonly contactService = inject(ContactService)

  readonly contact = input.required<Contact>()
  readonly figures = input.required<ContactOpeningSettlementFigures>()

  readonly loading = this.contactOpeningSettlementService.selectLoading

  readonly recordPanelCollapsed = signal(true)

  onChanged() {
    this.recordPanelCollapsed.set(true)
    this.contactService.refetch()
  }
}

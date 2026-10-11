import {Component, computed, inject, input, model, output} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ButtonDirective} from 'primeng/button'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ContactFormComponent} from '../contact-form/contact-form.component'
import {ContactLedgerComponent} from '../contact-ledger/contact-ledger.component'
import {ContactNamePipe} from '../contact-name.pipe'

@Component({
  selector: 'rts-contact-detail',
  templateUrl: 'contact-detail.component.html',
  imports: [
    ButtonDirective,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    LoadingContainerComponent,
    ContactFormComponent,
    ContactLedgerComponent,
    ContactNamePipe
  ]
})
export class ContactDetailComponent {
  private readonly contactService = inject(ContactService)

  readonly contactId = input.required<EntityId>()
  readonly closed = output<void>()

  readonly contact = computed(() => this.contactService.selectForId(this.contactId()))
  readonly loading = this.contactService.selectLoading
  readonly selectedTab = model<string | number | undefined>('details')
}

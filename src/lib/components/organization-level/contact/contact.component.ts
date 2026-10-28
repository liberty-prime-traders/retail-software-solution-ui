import {Component, inject, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {UserContextService} from '../../../utils/services/auth/user-context.service'
import {JoinEnumPipe} from '../../../utils/pipes/join-enum.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {MoneyComponent} from '../../reusable/money.component'
import {BulkContactImportComponent} from './bulk-contact-import/bulk-contact-import.component'
import {ContactDetailComponent} from './contact-detail/contact-detail.component'
import {ContactFormComponent} from './contact-form/contact-form.component'
import {ContactNamePipe} from './contact-name.pipe'

@Component({
  selector: 'rts-contact',
  templateUrl: 'contact.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    ButtonDirective,
    ContactFormComponent,
    BulkContactImportComponent,
    ContactDetailComponent,
    GridFilterComponent,
    EmptyRowComponent,
    PrettifyEnumPipe,
    ContactNamePipe,
    AutoStretchDirective,
    JoinEnumPipe,
    MoneyComponent
  ]
})
export class ContactComponent extends GridWithAddButtonComponent<ContactService> {
  private readonly contactService = inject(ContactService)
  readonly apiService = this.contactService

  readonly contacts = this.contactService.selectAll
  readonly selectedContactId = signal<EntityId | undefined>(undefined)

  readonly showBulkImport = inject(UserContextService).isLibertyAdmin
  readonly showBulkImportScreen = signal(false)

  toggleBulkImport() {
    this.showBulkImportScreen.set(!this.showBulkImportScreen())
  }

  finishBulkImport() {
    this.showBulkImportScreen.set(false)
  }
}

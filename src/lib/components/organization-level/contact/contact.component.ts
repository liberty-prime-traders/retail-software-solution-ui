import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {JoinEnumPipe} from '../../../utils/pipes/join-enum.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {ContactFormComponent} from './contact-form/contact-form.component'
import {ContactNamePipe} from './contact-name.pipe'

@Component({
  selector: 'rts-contact',
  templateUrl: 'contact.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    ContactFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    PrettifyEnumPipe,
    ContactNamePipe,
    AutoStretchDirective,
    JoinEnumPipe
  ]
})
export class ContactComponent extends GridWithAddButtonComponent<ContactService> {
  private readonly contactService = inject(ContactService)
  readonly apiService = this.contactService

  readonly contacts = this.contactService.selectAll
}

import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {Contact} from '../../../api/organization-level/contact/contact.model'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {ContactType} from '../../../api/organization-level/contact/contact-type.enum'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {ContactNamePipe} from './contact-name.pipe'
import {ContactFormComponent} from './contact-form/contact-form.component'

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
    Divider,
    NgClass,
    NgTemplateOutlet,
    PrettifyEnumPipe,
    ContactNamePipe,
    AutoStretchDirective
  ]
})
export class ContactComponent extends GridWithAddButtonComponent<ContactService> {
  private readonly contactService = inject(ContactService)
  readonly apiService = this.contactService

  readonly selectedContactType = signal<ContactType | undefined>(ContactType.CUSTOMER)
  readonly selectedContactTypeStash = signal<ContactType | undefined>(undefined)
  readonly contacts = computed(() => this.contactService.selectAll().filter(
    contact => contact.contactType === this.selectedContactType())
  )

  readonly CONTACT_TYPES = Object.values(ContactType)

  selectContactType(contactType: ContactType) {
    this.selectedContactType.set(contactType)
    this.addingIsActive.set(false)
  }

  override setAddingActiveTrue() {
    this.addingIsActive.set(true)
    this.selectedContactTypeStash.set(this.selectedContactType())
    this.selectedContactType.set(undefined)
  }

  override setAddingActiveFalse() {
    this.addingIsActive.set(false)
    this.selectedContactType.set(this.selectedContactTypeStash())
  }

  contactCreated(saved: Contact) {
    this.setAddingActiveFalse()
    this.selectedContactType.set(saved.contactType)
  }
}

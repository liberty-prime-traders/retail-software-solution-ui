import {Component, computed, inject, Input, signal} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Panel} from 'primeng/panel'
import {Select} from 'primeng/select'
import {Contact} from '../../../../api/organization-level/contact/contact.model'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {ContactStatus} from '../../../../api/organization-level/contact/contact-status.enum'
import {ContactType} from '../../../../api/organization-level/contact/contact-type.enum'
import {IdentityType} from '../../../../api/organization-level/contact/identity-type.enum'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ContactFormDefinition} from './contact-form.definition'


@Component({
  selector: 'rts-contact-form',
  templateUrl: 'contact-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    Select,
    EnumToDropdownPipe,
    InputNumber,
    FormField,
    Panel
  ]
})
export class ContactFormComponent extends BaseFormComponent<ContactService> {

  private readonly contactService = inject(ContactService)
  protected override apiService: ContactService = this.contactService

  @Input()
  set contact(contact: Contact|null) {
    if (contact) {
      this.originalContact.set(contact)
      this.contactFormValue.set(ContactFormDefinition.convertToFormModel(contact))
    }
  }

  readonly contactType = ContactType
  readonly contactStatus = ContactStatus
  readonly identityType = IdentityType

  readonly contactFormValue = signal<ContactFormDefinition.ContactFormModel>(
    ContactFormDefinition.defaultContactFormModel
  )

  readonly originalContact = signal<Contact|undefined>(undefined)
  readonly contactForm = form(this.contactFormValue, ContactFormDefinition.contactFormSchema)
  readonly contactFormFields = ContactFormDefinition.fieldMap
  readonly isOrganization = computed(() => this.contactFormValue().identityType === IdentityType.ORGANIZATION)

  resetForm() {
    this.contactFormValue.set(ContactFormDefinition.convertToFormModel(this.originalContact()))
  }

  upsertContact() {
    const updatedContact: Partial<Contact> = ContactFormDefinition.convertToBackendModel(this.contactFormValue())
    if (updatedContact.id) {
      this.contactService.put(updatedContact)
    } else {
      this.contactService.post(updatedContact)
    }
    this.savedAtLeastOnce.set(true)
  }

  deleteContact() {
    if (this.contactFormValue()?.id) {
      this.contactService.delete(this.contactFormValue()?.id)
    }
  }
}

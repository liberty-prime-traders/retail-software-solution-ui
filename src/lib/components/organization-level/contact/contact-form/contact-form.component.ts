import {Component, computed, inject, Input, model, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {FormField, form} from '@angular/forms/signals'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Panel} from 'primeng/panel'
import {Select} from 'primeng/select'
import {Checkbox} from 'primeng/checkbox'
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
    Panel,
    Checkbox,
    FormsModule
  ]
})
export class ContactFormComponent extends BaseFormComponent<ContactService> {

  private readonly contactService = inject(ContactService)
  protected override apiService: ContactService = this.contactService

  readonly contactCreated = output<Contact>()

  @Input()
  set contact(contact: Contact|null) {
    if (contact) {
      this.originalContact.set(contact)
      this.contactFormValue.set(ContactFormDefinition.convertToFormModel(contact))
      this.selectedContactTypes.set(contact.contactTypes)
    }
  }

  readonly ContactType = ContactType
  readonly contactStatus = ContactStatus
  readonly identityType = IdentityType
  readonly selectedContactTypes = model<ContactType[]>([ContactType.CUSTOMER])

  readonly contactFormValue = signal<ContactFormDefinition.ContactFormModel>(
    ContactFormDefinition.defaultContactFormModel
  )

  readonly originalContact = signal<Contact|undefined>(undefined)
  readonly contactForm = form(this.contactFormValue, ContactFormDefinition.contactFormSchema)
  readonly contactFormFields = ContactFormDefinition.fieldMap
  readonly isOrganization = computed(() => this.contactFormValue().identityType === IdentityType.ORGANIZATION)

  onContactTypeChecked() {
    this.contactFormValue.update(formValue => ({
      ...formValue,
      contactTypes: this.selectedContactTypes()
    }))
    this.contactForm().markAsDirty()
  }

  resetForm() {
    this.contactFormValue.set(ContactFormDefinition.convertToFormModel(this.originalContact()))
    this.selectedContactTypes.set(this.originalContact()?.contactTypes ?? [ContactType.CUSTOMER])
  }

  upsertContact() {
    const updatedContact: Partial<Contact> = ContactFormDefinition.convertToBackendModel(this.contactFormValue())
    if (updatedContact.id) {
      this.contactService.put(updatedContact)
    } else {
      this.contactService.post(updatedContact, {
        onSuccess: (saved) => this.contactCreated.emit(saved)
      })
    }
  }

  deleteContact() {
    if (this.contactFormValue()?.id) {
      this.contactService.delete(this.contactFormValue()?.id)
    }
  }
}

import {applyWhen, minLength, pattern, required, schema, SchemaPath} from '@angular/forms/signals'
import {Contact} from '../../../../api/organization-level/contact/contact.model'
import {ContactStatus} from '../../../../api/organization-level/contact/contact-status.enum'
import {ContactType} from '../../../../api/organization-level/contact/contact-type.enum'
import {IdentityType} from '../../../../api/organization-level/contact/identity-type.enum'

export namespace ContactFormDefinition {
  export interface ContactFormModel {
    id: string
    contactTypes: ContactType[]
    identityType: IdentityType
    firstName: string
    lastName: string
    companyName: string
    email: string
    phone: string
    address: string
    creditLimit: number | null
    notes: string
    status: ContactStatus
  }

  export const fieldMap = new Map<keyof ContactFormModel, string>(
    [
      ['contactTypes', 'Contact Types'],
      ['identityType', 'Identity Type'],
      ['firstName', 'First Name'],
      ['lastName', 'Last Name'],
      ['companyName', 'Company Name'],
      ['email', 'Email'],
      ['phone', 'Phone'],
      ['address', 'Address'],
      ['creditLimit', 'Credit Limit'],
      ['notes', 'Notes'],
      ['status', 'Status']
    ]
  )

  export const defaultContactFormModel: ContactFormModel = {
    id: '',
    contactTypes: [ContactType.CUSTOMER],
    identityType: IdentityType.INDIVIDUAL,
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    creditLimit: null,
    notes: '',
    status: ContactStatus.ACTIVE
  }

  export const contactFormSchema = schema<ContactFormModel>(path=> {
    minLength(path.contactTypes, 1, {message: 'At least one contact type must be selected.'})
    required(path.identityType)
    required(path.status)

    pattern(path.phone, /^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })

    applyWhen(
      path.firstName,
      ({ valueOf }) => valueOf(path.identityType) === IdentityType.INDIVIDUAL,
      (firstNamePath: SchemaPath<string>) => { required(firstNamePath) }
    )

    applyWhen(
      path.companyName,
      ({ valueOf }) => valueOf(path.identityType) === IdentityType.ORGANIZATION,
      (companyNamePath: SchemaPath<string>) => { required(companyNamePath) }
    )
  })

  export const convertToFormModel = (contact?: Contact): ContactFormModel => ({
    id: contact?.id as string ?? '',
    contactTypes: contact?.contactTypes ?? [ContactType.CUSTOMER],
    identityType: contact?.identityType ?? IdentityType.INDIVIDUAL,
    firstName: contact?.firstName ?? '',
    lastName: contact?.lastName ?? '',
    companyName: contact?.companyName ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    address: contact?.address ?? '',
    creditLimit: contact?.creditLimit ?? null,
    notes: contact?.notes ?? '',
    status: contact?.status ?? ContactStatus.ACTIVE
  })

  export const convertToBackendModel = (formValue: ContactFormModel): Partial<Contact> => ({
    id: formValue.id,
    contactTypes: formValue.contactTypes,
    identityType: formValue.identityType,
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    companyName: formValue.companyName,
    email: formValue.email,
    phone: formValue.phone,
    address: formValue.address,
    creditLimit: formValue.creditLimit ?? undefined,
    notes: formValue.notes,
    status: formValue.status
  })
}

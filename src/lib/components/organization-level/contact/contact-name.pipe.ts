import {Pipe, PipeTransform} from '@angular/core'
import {Contact} from '../../../api/organization-level/contact/contact.model'
import {IdentityType} from '../../../api/organization-level/contact/identity-type.enum'

@Pipe({name: 'contactName', standalone: true})
export class ContactNamePipe implements PipeTransform {
  transform(contact: Contact | null | undefined): string {
    if (!contact) {
      return '--'
    }

    if (contact.identityType === IdentityType.ORGANIZATION) {
      return contact.companyName || '--'
    }

    const firstName = contact.firstName || ''
    const lastName = contact.lastName || ''
    return `${firstName} ${lastName}`.trim() || '--'
  }
}

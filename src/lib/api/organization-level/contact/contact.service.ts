import {computed, Injectable} from '@angular/core'
import {ContactType} from './contact-type.enum'
import {BaseService} from '../../util/base-api/base.service'
import {Contact} from './contact.model'
import {ContactStore} from './contact.store'

@Injectable({providedIn: 'root'})
export class ContactService extends BaseService<Contact> {

  readonly suppliers = computed(() =>
    this.selectAll().filter(contact => contact.contactTypes.includes(ContactType.SUPPLIER))
  )

  readonly customers = computed(() =>
    this.selectAll().filter(contact => contact.contactTypes.includes(ContactType.CUSTOMER))
  )

  constructor(protected override readonly store: ContactStore) {
    super(store)
  }
}

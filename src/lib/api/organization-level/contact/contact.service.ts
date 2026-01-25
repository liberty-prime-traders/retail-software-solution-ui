import {computed, Injectable} from '@angular/core'
import {ContactType} from '../../../utils/types/contact-type.enum'
import {BaseService} from '../../util/base-api/base.service'
import {Contact} from './contact.model'
import {ContactStore} from './contact.store'

@Injectable({providedIn: 'root'})
export class ContactService extends BaseService<Contact> {

  readonly customers = computed(() =>
    this.selectAll().filter(contact => contact.contactType === ContactType.CUSTOMER)
  )

  readonly vendors = computed(() =>
    this.selectAll().filter(contact => contact.contactType === ContactType.VENDOR)
  )

  readonly suppliers = computed(() =>
    this.selectAll().filter(contact => contact.contactType === ContactType.SUPPLIER)
  )

  constructor(protected override readonly store: ContactStore) {
    super(store)
  }
}

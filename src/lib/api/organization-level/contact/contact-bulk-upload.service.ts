import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {ContactBulkUploadDto} from './contact-bulk-upload.dto'
import {Contact} from './contact.model'
import {ContactStore} from './contact.store'

@Injectable({providedIn: 'root'})
export class ContactBulkUploadService extends BaseService<Contact, ContactBulkUploadDto> {

  constructor(protected override readonly store: ContactStore) {
    super(store)
  }

  uploadContacts(contactBulkUploadDtos: ContactBulkUploadDto[], callbacks?: ApiCallbacks<Contact>) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'bulk'})
    return this.post(contactBulkUploadDtos, callbacks)
  }
}

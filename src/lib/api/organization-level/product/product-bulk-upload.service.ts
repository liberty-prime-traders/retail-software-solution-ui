import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {OrganizationProduct} from './organization-product.model'
import {OrganizationProductStore} from './organization-product.store'
import {ProductBulkUploadRequest} from './product-bulk-upload-request.dto'

@Injectable({providedIn: 'root'})
export class ProductBulkUploadService extends BaseService<OrganizationProduct, ProductBulkUploadRequest> {

  constructor(protected override readonly store: OrganizationProductStore) {
    super(store)
  }

  uploadProducts(request: ProductBulkUploadRequest, callbacks?: ApiCallbacks<OrganizationProduct>) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'bulk'})
    return this.post(request, callbacks)
  }
}

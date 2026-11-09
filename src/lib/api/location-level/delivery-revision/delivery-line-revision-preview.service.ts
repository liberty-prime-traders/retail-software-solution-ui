import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {DeliveryLineRevisionPreview} from './delivery-line-revision-preview.model'
import {DeliveryLineRevisionPreviewStore} from './delivery-line-revision-preview.store'
import {DeliveryLineRevisionRequest} from './delivery-line-revision-request.model'

@Injectable({providedIn: 'root'})
export class DeliveryLineRevisionPreviewService
  extends BaseService<DeliveryLineRevisionPreview, DeliveryLineRevisionRequest> {

  constructor(protected override readonly store: DeliveryLineRevisionPreviewStore) {
    super(store)
  }

  preview(
    deliveryLineRevisionRequest: DeliveryLineRevisionRequest,
    callbacks?: ApiCallbacks<DeliveryLineRevisionPreview>
  ): Subscription {
    return this.postRequest({
      body: deliveryLineRevisionRequest,
      callbacks,
      config: {urlSuffix: 'line-revisions/preview'}
    })
  }
}

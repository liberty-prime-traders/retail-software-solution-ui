import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {DeliveryLineRevisionPreview} from './delivery-line-revision-preview.model'

@Injectable({providedIn: 'root'})
export class DeliveryLineRevisionPreviewStore
  extends createBaseStore<DeliveryLineRevisionPreview>(preview => preview.revisedDeliveryLineReferenceNumber)
  implements BaseStore<DeliveryLineRevisionPreview> {

  readonly basePath = 'deliveries'
}

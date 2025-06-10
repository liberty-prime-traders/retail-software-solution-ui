import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {BaseService} from '../base-api/base.service'
import {EndUserJoinRequest} from './end-user-join-request.model'
import {EndUserJoinRequestStore} from './end-user-join-request.store'

@Injectable({providedIn: 'root'})
export class EndUserJoinRequestService extends BaseService<EndUserJoinRequest, Array<EntityId>> {
  constructor(protected override readonly store: EndUserJoinRequestStore) {
    super(store)
  }

  respondToJoinRequests$(joinRequestIds: Array<EntityId>, response: 'admit' | 'deny') {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: response})
    this.post(joinRequestIds)
  }
}

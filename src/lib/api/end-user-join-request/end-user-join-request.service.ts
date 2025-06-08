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

  admitJoinRequests$(joinRequestIds: Array<EntityId>) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'admit'})
    this.post(joinRequestIds)
  }
}

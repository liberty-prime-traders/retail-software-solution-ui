import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {EndUserJoinRequest} from './end-user-join-request.model'
import {EndUserJoinRequestStore} from './end-user-join-request.store'

@Injectable({providedIn: 'root'})
export class EndUserJoinRequestService extends BaseService<EndUserJoinRequest> {
  constructor(protected override readonly store: EndUserJoinRequestStore) {
    super(store)
  }
}

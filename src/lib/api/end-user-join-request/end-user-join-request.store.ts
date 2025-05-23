import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {EndUserJoinRequest} from './end-user-join-request.model'

@Injectable({providedIn: 'root'})
export class EndUserJoinRequestStore extends createBaseStore<EndUserJoinRequest>()
  implements BaseStore<EndUserJoinRequest> {
  readonly basePath = 'organizations/join-requests'
}

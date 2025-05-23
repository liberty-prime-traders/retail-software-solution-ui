import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {MyJoinRequest} from './my-join-request.model'

@Injectable({providedIn: 'root'})
export class MyJoinRequestStore extends createBaseStore<MyJoinRequest>() implements BaseStore<MyJoinRequest> {
  readonly basePath = 'organizations/me/join-requests'
}

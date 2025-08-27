import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {MyJoinRequest} from './my-join-request.model'

@Injectable({providedIn: 'root'})
export class MyJoinRequestStore extends createBaseStore<MyJoinRequest>() implements BaseStore<MyJoinRequest> {
  readonly basePath = 'join-requests/me'
}

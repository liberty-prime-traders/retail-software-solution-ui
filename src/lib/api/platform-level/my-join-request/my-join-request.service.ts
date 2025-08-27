import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {MyJoinRequest} from './my-join-request.model'
import {MyJoinRequestStore} from './my-join-request.store'

@Injectable({providedIn: 'root'})
export class MyJoinRequestService extends BaseService<MyJoinRequest> {
  constructor(protected override readonly store: MyJoinRequestStore) {
    super(store)
  }
}

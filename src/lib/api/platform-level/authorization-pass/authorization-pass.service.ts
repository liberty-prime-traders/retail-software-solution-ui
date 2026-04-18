import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {AuthorizationPass} from './authorization-pass.model'
import {AuthorizationPassStore} from './authorization-pass.store'

@Injectable({providedIn: 'root'})
export class AuthorizationPassService extends BaseService<AuthorizationPass> {
  constructor(protected override readonly store: AuthorizationPassStore) {
    super(store)
  }

  issue(dto: Partial<AuthorizationPass>, callbacks?: ApiCallbacks<AuthorizationPass>): Subscription {
    return this.post(dto, callbacks)
  }

  revoke(id: EntityId, callbacks?: ApiCallbacks<AuthorizationPass>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'revoke'})
    return this.putRequest({id, callbacks})
  }
}

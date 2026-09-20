import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {BaseStore} from '../../util/base-api/base.store'
import {MembershipUserSummary} from './membership-user-summary.model'

export abstract class MembershipUserService extends BaseService<MembershipUserSummary, Array<EntityId>> {

  protected constructor(store: BaseStore<MembershipUserSummary>) {
    super(store)
  }

  terminateUsers(userIds: Array<EntityId>, apiCallbacks: ApiCallbacks<MembershipUserSummary>) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'terminate'})
    this.post(userIds, this.applyInternalCallBacks({onSuccess: () => this.removeEntities(userIds)}, apiCallbacks))
  }
}

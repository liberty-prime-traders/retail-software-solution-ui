import {BaseStore} from '../../util/base-api/base.store'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {UserAccessDetail} from './authority.model'

export abstract class UserAccessDetailService extends MultimapBaseService<UserAccessDetail> {

  protected override keyPath: keyof UserAccessDetail = 'userId'

  protected constructor(store: BaseStore<UserAccessDetail>) {
    super(store)
  }

  getForUser(userId: string) {
    return this.refetch(userId)
  }
}

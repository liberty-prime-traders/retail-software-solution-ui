import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {UnitGroup, UnitGroupCreateRequest, UnitGroupUpdateRequest} from './unitgroup.model'
import {UnitGroupStore} from './unitgroup.store'

@Injectable({providedIn: 'root'})
export class UnitGroupService extends BaseService<UnitGroup, UnitGroupCreateRequest | UnitGroupUpdateRequest> {
  constructor(protected override readonly store: UnitGroupStore) {
    super(store)
  }
}

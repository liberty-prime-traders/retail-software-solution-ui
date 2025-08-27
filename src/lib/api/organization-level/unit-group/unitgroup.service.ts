import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {UnitGroup} from './unitgroup.model'
import {UnitGroupStore} from './unitgroup.store'

@Injectable({providedIn: 'root'})
export class UnitGroupService extends BaseService<UnitGroup> {
  constructor(protected override readonly store: UnitGroupStore) {
    super(store)
  }
}

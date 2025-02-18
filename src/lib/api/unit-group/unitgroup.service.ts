import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {UnitGroup} from './unitgroup.model'
import {UnitGroupState} from './unitgroup.state'
import {UnitGroupStore} from './unitgroup.store'
import {UnitGroupQuery} from './unitgroup.query'

@Injectable({providedIn: 'root'})
export class UnitGroupService extends BaseService<UnitGroup, UnitGroupState> {
  constructor(protected override readonly store: UnitGroupStore,
              protected override readonly query: UnitGroupQuery) {
    super(store, query)
  }
}

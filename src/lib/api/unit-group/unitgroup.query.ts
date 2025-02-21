import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {UnitGroup} from './unitgroup.model'
import {UnitGroupState} from './unitgroup.state'
import {UnitGroupStore} from './unitgroup.store'

@Injectable({providedIn: 'root'})
export class UnitGroupQuery extends BaseQuery<UnitGroup, UnitGroupState> {
  constructor(protected override readonly store: UnitGroupStore) {
    super(store)
  }
}

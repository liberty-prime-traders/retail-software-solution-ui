import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {BaseStore} from '../base-api/base.store'
import {UnitGroup} from './unitgroup.model'
import {UnitGroupState} from './unitgroup.state'
import {createInitialState} from '../base-api/base.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'unitgroups'})
export class UnitGroupStore extends BaseStore<UnitGroup, UnitGroupState> {
  constructor() {
    super(createInitialState())
  }
}

import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {BaseStore} from '../base-api/base.store'
import {UnitValue} from './unitvalue.model'
import {UnitValueState} from './unitvalue.state'
import {createInitialState} from '../base-api/base.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'unitvalues'})
export class UnitValueStore extends BaseStore<UnitValue, UnitValueState> {
  constructor() {
    super(createInitialState())
  }
}

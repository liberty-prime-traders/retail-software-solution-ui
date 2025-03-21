import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {UnitValue} from './unitvalue.model'
import {UnitValueState} from './unitvalue.state'
import {UnitValueStore} from './unitvalue.store'

@Injectable({providedIn: 'root'})
export class UnitValueQuery extends BaseQuery<UnitValue, UnitValueState> {
  constructor(protected override readonly store: UnitValueStore) {
    super(store)
  }
}

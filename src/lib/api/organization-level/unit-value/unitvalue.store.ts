import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {UnitValue} from './unitvalue.model'

@Injectable({providedIn: 'root'})
export class UnitValueStore extends createBaseStore<UnitValue>() implements BaseStore<UnitValue> {
  readonly basePath = 'unitvalues'
}

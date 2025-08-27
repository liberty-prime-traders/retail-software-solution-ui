import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {UnitGroup} from './unitgroup.model'

@Injectable({providedIn: 'root'})
export class UnitGroupStore extends createBaseStore<UnitGroup>() implements BaseStore<UnitGroup> {
  readonly basePath = 'unitgroups'
}

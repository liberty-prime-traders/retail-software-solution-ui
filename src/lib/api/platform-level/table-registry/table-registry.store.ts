import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {TableRegistry} from './table-registry.model'

@Injectable({providedIn: 'root'})
export class TableRegistryStore extends createBaseStore<TableRegistry>() implements BaseStore<TableRegistry> {
  readonly basePath = 'table-registries'
}

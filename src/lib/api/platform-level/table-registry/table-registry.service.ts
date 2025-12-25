import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {TableRegistry} from './table-registry.model'
import {TableRegistryStore} from './table-registry.store'

@Injectable({providedIn: 'root'})
export class TableRegistryService extends BaseService<TableRegistry> {
  constructor(protected override readonly store: TableRegistryStore) {
    super(store)
  }

  validateRegistry(registryId: string) {
    this.patchApiRequestConfig({urlSuffix: `validate`})
    return this.putWithId(registryId)
  }
}

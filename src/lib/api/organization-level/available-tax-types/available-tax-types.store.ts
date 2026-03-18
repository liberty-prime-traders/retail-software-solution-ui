import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {AvailableTaxTypesNode} from './available-tax-types.node'

@Injectable({providedIn: 'root'})
export class AvailableTaxTypesStore extends createBaseStore<AvailableTaxTypesNode>()
  implements BaseStore<AvailableTaxTypesNode> {

  readonly basePath = 'org-jurisdiction-tax-types/available'
}

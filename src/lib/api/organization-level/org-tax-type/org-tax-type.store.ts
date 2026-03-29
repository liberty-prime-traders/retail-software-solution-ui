import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {OrgTaxType} from './org-tax-type.model'

@Injectable({providedIn: 'root'})
export class OrgTaxTypeStore extends createBaseStore<OrgTaxType>()
  implements BaseStore<OrgTaxType> {

  readonly basePath = 'org-tax-types'
}

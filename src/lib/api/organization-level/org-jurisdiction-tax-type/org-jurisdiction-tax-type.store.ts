import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {OrgJurisdictionTaxType} from './org-jurisdiction-tax-type.model'

@Injectable({providedIn: 'root'})
export class OrgJurisdictionTaxTypeStore extends createBaseStore<OrgJurisdictionTaxType>()
  implements BaseStore<OrgJurisdictionTaxType> {

  readonly basePath = 'org-jurisdiction-tax-types'
}

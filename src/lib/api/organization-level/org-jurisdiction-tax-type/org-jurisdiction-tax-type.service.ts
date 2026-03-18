import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {OrgJurisdictionTaxType} from './org-jurisdiction-tax-type.model'
import {OrgJurisdictionTaxTypeStore} from './org-jurisdiction-tax-type.store'

@Injectable({providedIn: 'root'})
export class OrgJurisdictionTaxTypeService extends BaseService<OrgJurisdictionTaxType> {

  constructor(protected override readonly store: OrgJurisdictionTaxTypeStore) {
    super(store)
  }

  override post(body?: Partial<OrgJurisdictionTaxType>[], callbacks?: ApiCallbacks<OrgJurisdictionTaxType>): Subscription {
    this.patchApiRequestConfig({upsertOnSuccess: true})
    return super.post(body, callbacks)
  }
}

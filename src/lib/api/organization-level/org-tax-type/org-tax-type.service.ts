import {computed, Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {OrgTaxTypeStatus} from './org-tax-type-status.enum'
import {OrgTaxType} from './org-tax-type.model'
import {OrgTaxTypeStore} from './org-tax-type.store'

@Injectable({providedIn: 'root'})
export class OrgTaxTypeService extends BaseService<OrgTaxType> {

  readonly activeTaxTypes = computed(() =>
    this.selectAll().filter(taxType => taxType.status === OrgTaxTypeStatus.ACTIVE)
  )

  constructor(protected override readonly store: OrgTaxTypeStore) {
    super(store)
  }

  override post(body?: Partial<OrgTaxType>[], callbacks?: ApiCallbacks<OrgTaxType>): Subscription {
    this.patchApiRequestConfig({upsertOnSuccess: true})
    return super.post(body, callbacks)
  }
}

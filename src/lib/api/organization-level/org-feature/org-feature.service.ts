import {HttpErrorResponse} from '@angular/common/http'
import {computed, Injectable, signal} from '@angular/core'
import {Subscription} from 'rxjs'
import {Feature} from '../../platform-level/platform-feature/feature.enum'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {OrganizationFeatureStatus} from './org-feature-status.enum'
import {OrganizationFeature} from './org-feature.model'
import {OrgFeatureStore} from './org-feature.store'

@Injectable({providedIn: 'root'})
export class OrgFeatureService extends BaseService<OrganizationFeature, Feature[]> {

  private readonly activationFailures = signal<string[]>([])
  readonly activationFailureMessages = this.activationFailures.asReadonly()

  readonly activeFeatures = computed(() =>
    this.selectAll().filter(f => f.status === OrganizationFeatureStatus.ACTIVE)
  )

  readonly isChartOfAccountsEnabled = computed(() =>
    this.activeFeatures().some(f => f.feature === Feature.CHART_OF_ACCOUNTS)
  )

  readonly isTaxEnabled = computed(() =>
    this.activeFeatures().some(f => f.feature === Feature.TAX_CONFIGURATION)
  )

  constructor(protected override readonly store: OrgFeatureStore) {
    super(store)
  }

  private onActivationError = (error: HttpErrorResponse) => {
    const errorBody = error?.error?.body as Array<string>
    this.activationFailures.set(errorBody ?? [])
  }

  activate(features: Feature[], callbacks?: ApiCallbacks<OrganizationFeature>): Subscription {
    this.activationFailures.set([])
    this.patchApiRequestConfig({urlSuffix: 'activate'})
    return this.post(features, {
      onSuccess: callbacks?.onSuccess,
      onFail: (error) => {
        this.onActivationError(error)
        callbacks?.onFail?.(error)
      }
    })
  }

  deactivate(features: Feature[], callbacks?: ApiCallbacks<OrganizationFeature>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'deactivate'})
    return this.post(features, callbacks)
  }

}

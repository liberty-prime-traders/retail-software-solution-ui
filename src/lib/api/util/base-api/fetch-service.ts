import {HttpClient, HttpParams} from '@angular/common/http'
import {inject} from '@angular/core'
import {isNil} from 'lodash-es'
import {defer, finalize, Observable, Subscription} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {SessionReauthenticationService} from '../../../utils/services/auth/session-reauthentication.service'
import {ApiCallbacks} from './api-callbacks'
import {ApiGetRequestModel, FetchParams} from './api-get-request.model'
import {ApiRequestConfig} from './api-request-config'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'
import {ServiceFacade} from './service.facade'

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE'

export abstract class FetchService<RESPONSE extends BaseModel> extends ServiceFacade<RESPONSE> {

  private readonly inFlight = new Map<HttpVerb, Subscription>()
  protected readonly sessionReauthenticationService = inject(SessionReauthenticationService)

  protected constructor(protected override readonly store: BaseStore<RESPONSE>, private readonly fetcher: HttpClient) {
    super(store)
  }

  fetch(params?: FetchParams) {
    return this.fetchRequest({params})
  }

  refetch(params?: FetchParams, callbacks?: ApiCallbacks<RESPONSE>, config?: Partial<ApiRequestConfig>) {
    this.resetStoreAndClearCache()
    return this.fetchRequest({params, callbacks, config})
  }

  refetchRequest(apiRequest: ApiGetRequestModel<RESPONSE, FetchParams>) {
    this.store.setHasCache(false)
    return this.fetchRequest(apiRequest)
  }

  fetchRequest(apiRequest: ApiGetRequestModel<RESPONSE>): Subscription | undefined {
    if (!this.shouldMakeCall()) {
      return undefined
    }
    if (this.allowMultipleCalls()) {
      this.releaseInFlight('GET')
    }
    const subscription = this.whenSessionReady(apiRequest.config, () => this.sendFetch(apiRequest)).subscribe()
    return this.captureInFlight('GET', subscription)
  }

  private sendFetch(apiRequest: ApiGetRequestModel<RESPONSE>): Observable<RESPONSE> {
    const {id, params, callbacks, config} = apiRequest
    return defer(() => {
      this.startApiRequest()
      return this.fetcher.get<RESPONSE>(this.fetchUrl(apiRequest), {params: this.getHttpParams(params)})
    }).pipe(
      tap((body) => {
        this.finishSavingWithSuccess(body, {id, config})
        callbacks?.onSuccess?.(body)
      }),
      catchError((error) => {
        callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
  }

  private fetchUrl(apiRequest: ApiGetRequestModel<RESPONSE>): string {
    const {id, params, config} = apiRequest
    const matrixParams = this.assembleMatrixParams(this.getMatrixParams(params))
    const pathSuffix = this.getPathSuffix(params)
    const suffix = pathSuffix ? `/${pathSuffix}` : ''
    return `${this.getBasePath(id, config)}${suffix}${this.getPathParams(params)}${matrixParams}`
  }

  // Only secured calls wait for sign-in; the sign-in request itself must go out while the prompt is open.
  protected whenSessionReady<T>(config: Partial<ApiRequestConfig> | undefined, send: () => Observable<T>): Observable<T> {
    if (this.isSecuredRequest(config)) {
      return this.sessionReauthenticationService.whenSignedIn(send)
    }
    return send()
  }

  protected captureInFlight(verb: HttpVerb, subscription: Subscription): Subscription {
    this.inFlight.set(verb, subscription)
    return subscription
  }

  protected releaseInFlight(verb: HttpVerb): void {
    this.inFlight.get(verb)?.unsubscribe()
    this.inFlight.delete(verb)
  }

  private shouldMakeCall() {
    return (!this.selectLoading() || this.allowMultipleCalls()) && !this.store.hasCache()
  }

  protected allowMultipleCalls(): boolean {
    return false
  }

  resetStoreAndClearCache() {
    this.store.resetStore()
    this.removeCache()
  }

  private removeCache(): void {
    this.store.setHasCache(false)
  }

  private assembleMatrixParams(params: HttpParams): string {
    if (!isNil(params) && params.keys().length <= 0) {
      return ''
    }
    const paramsAsArray = params.keys().map(key => `${key}=${params.get(key)}`)
    return `;${paramsAsArray.join(';')}`
  }

  protected getMatrixParams(params: FetchParams): HttpParams {
    return new HttpParams()
  }

  protected getPathParams(params: FetchParams): string {
    return params?.pathParams ?? ''
  }

  protected getHttpParams(params: FetchParams): HttpParams {
    return this.appendHttpParams(new HttpParams(), params)
  }

  protected appendHttpParams(httpParams: HttpParams, params: FetchParams): HttpParams {
    return httpParams
  }

  protected getPathSuffix(params: FetchParams): string {
    return params?.pathSuffix ?? ''
  }
}

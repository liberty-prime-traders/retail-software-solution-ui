import {HttpClient, HttpParams} from '@angular/common/http'
import {isNil} from 'lodash-es'
import {finalize, Subscription} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {ApiCallbacks} from './api-callbacks'
import {ApiGetRequestModel, FetchParams} from './api-get-request.model'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'
import {ServiceFacade} from './service.facade'

export abstract class FetchService<RESPONSE extends BaseModel> extends ServiceFacade<RESPONSE> {
  protected constructor(protected override readonly store: BaseStore<RESPONSE>, private readonly fetcher: HttpClient) {
    super(store)
  }

  fetch(params?: FetchParams) {
    return this.fetchRequest({params})
  }

  refetch(params?: FetchParams, callbacks?: ApiCallbacks<RESPONSE>) {
    this.resetStoreAndClearCache()
    return this.fetchRequest({params, callbacks})
  }

  refetchRequest(apiRequest: ApiGetRequestModel<RESPONSE, FetchParams>) {
    this.store.setHasCache(false)
    return this.fetchRequest(apiRequest)
  }

  fetchRequest(apiRequest: ApiGetRequestModel<RESPONSE, FetchParams>): Subscription | undefined {
    if (!this.shouldMakeCall()) {
      return undefined
    }
    const {id, params, callbacks} = apiRequest
    this.startApiRequest()
    const httpParams = this.getHttpParams(params)
    const matrixParams = this.assembleMatrixParams(this.getMatrixParams(params))
    const pathParams = this.getPathParams(params)
    const pathSuffix = this.getPathSuffix(params)
    const suffix = pathSuffix ? `/${pathSuffix}` : ''
    const url = `${this.getBasePath(id)}${suffix}${pathParams}${matrixParams}`
    return this.fetcher.get<RESPONSE>(url, {params: httpParams}).pipe(
      tap((body) => {
        this.finishSavingWithSuccess(body, id)
        callbacks?.onSuccess?.(body)
      }),
      catchError((error) => {
        callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
      .subscribe()
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
    return new HttpParams()
  }

  protected getPathSuffix(params: FetchParams): string {
    return params?.pathSuffix ?? ''
  }
}

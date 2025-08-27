import {HttpClient, HttpParams} from '@angular/common/http'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {finalize, Subscription} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {RtsHttpParams} from '../rts-http.params'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'
import {ServiceFacade} from './service.facade'

export type PARAMS = RtsHttpParams | any

export abstract class FetchService<RESPONSE extends BaseModel> extends ServiceFacade<RESPONSE> {
  protected constructor(protected override readonly store: BaseStore<RESPONSE>, private readonly fetcher: HttpClient) {
    super(store)
  }

  fetch(params?: PARAMS) {
    return this.doFetch(params)
  }

  refetch(params?: PARAMS) {
    this.resetStoreAndClearCache()
    return this.fetch(params)
  }

  fetchById(idParam: string, additionalParams?: PARAMS) {
    return this.doFetch(additionalParams, idParam)
  }

  private doFetch(params?: PARAMS, idParam?: EntityId): Subscription | undefined {
    if (!this.shouldMakeCall()) {
      return undefined
    }
    this.startApiRequest()
    const httpParams = this.getHttpParams(params)
    const matrixParams = this.assembleMatrixParams(this.getMatrixParams(params))
    const pathParams = this.getPathParams(params)
    const pathSuffix = this.getPathSuffix(params)
    const suffix = pathSuffix ? `/${pathSuffix}` : ''
    const url = `${this.getBasePath(idParam)}${suffix}${pathParams}${matrixParams}`
    return this.fetcher.get<RESPONSE>(url, {params: httpParams}).pipe(
      tap((body) => this.finishSavingWithSuccess(body, idParam)),
      catchError((error) => this.setStoreError(error)),
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

  protected getMatrixParams(params: PARAMS): HttpParams {
    return new HttpParams()
  }

  protected getPathParams(params: PARAMS): string {
    return params?.pathParams ?? ''
  }

  protected getHttpParams(params: PARAMS): HttpParams {
    return new HttpParams()
  }

  protected getPathSuffix(params: PARAMS): string {
    return params?.pathSuffix ?? ''
  }
}

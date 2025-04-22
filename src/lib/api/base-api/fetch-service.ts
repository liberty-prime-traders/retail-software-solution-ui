import {HttpClient, HttpParams} from '@angular/common/http'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {finalize, Subscription} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {RtsHttpParams} from '../util/rts-http.params'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'
import {ServiceFacade} from './service.facade'

export type PARAMS = RtsHttpParams | any

export abstract class FetchService<RESPONSE extends BaseModel> extends ServiceFacade<RESPONSE> {
  protected constructor(protected override readonly store: BaseStore<RESPONSE>, private readonly fetcher: HttpClient) {
    super(store)
  }

  fetch(params?: PARAMS, pathSuffix?: string) {
    return this.doFetch(params, pathSuffix)
  }

  refetch(params?: PARAMS, pathSuffix?: string) {
    this.resetStoreAndClearCache()
    return this.doFetch(params, pathSuffix)
  }

  fetchById(idParam: string, pathSuffix?: string, additionalParams?: PARAMS) {
    return this.doFetch(additionalParams, pathSuffix, idParam)
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

  private doFetch(params?: PARAMS, pathSuffix?: string, idParam?: EntityId): Subscription | undefined {
    if (!this.shouldMakeCall()) {
      return undefined
    }
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
    const httpParams = this.getHttpParams(params)
    const matrixParams = this.assembleMatrixParams(this.getMatrixParams(params))
    const pathParams = this.getPathParams(params)
    const suffix = pathSuffix ? `/${pathSuffix}` : ''
    const url = `${this.getBasePath(idParam)}${suffix}${pathParams}${matrixParams}`
    return this.fetcher.get<RESPONSE>(url, {params: httpParams}).pipe(
      tap((body) => this.finishSavingWithSuccess(body, idParam)),
      catchError((error) => this.setStoreError(error)),
      finalize(() => this.store.setLoading(false))
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
}

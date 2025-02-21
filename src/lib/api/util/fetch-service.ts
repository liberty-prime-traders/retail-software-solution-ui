import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http'
import {cacheable} from '@datorama/akita'
import {isNil} from 'lodash-es'
import {Observable, Subscription, throwError} from 'rxjs'
import {catchError, filter, map, tap} from 'rxjs/operators'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseModel} from '../base-api/base.model'
import {BaseQuery} from '../base-api/base.query'
import {BaseState} from '../base-api/base.state'
import {BaseStore} from '../base-api/base.store'
import {RtsHttpParams} from './rts-http.params'

export type PARAMS = RtsHttpParams | any

/**
 * FetchService should declare the same type as the Store. FetchService will
 * look at the store's name to resolve the base path {@see getBasePath}.
 */

export abstract class FetchService<ENTITY extends BaseModel, STATE extends BaseState<ENTITY>> {
  protected constructor(protected readonly store: BaseStore<ENTITY, STATE>,
                        protected readonly query: BaseQuery<ENTITY, STATE>,
                        protected readonly fetcher: HttpClient) {
  }

  readonly selectLoading$ = (): Observable<boolean> => this.query.selectLoading()

  readonly selectFirst$ = (): Observable<ENTITY> => this.query.selectFirst().pipe(
    filter(Boolean),
    map((first) => Array.isArray(first) ? first.at(0) : first)
  )

  readonly selectAll$ = () => this.query.selectAll()

  selectEntity(id: string): Observable<ENTITY|undefined> {
    return this.query.selectEntity(id)
  }

  fetch(params?: PARAMS) {
    return this.fetchFunctionality(params)
  }

  refetch(params?: PARAMS) {
    this.resetStoreAndClearCache()
    return this.fetchFunctionality(params)
  }

  resetStoreAndClearCache() {
    this.store.reset()
    this.removeCache()
  }

  removeCache(): void {
    this.store.setHasCache(false)
  }

  fetchById(idParam: string, additionalParams?: PARAMS) {
    return this.fetchFunctionality(additionalParams, idParam)
  }

  protected getBasePath(id?: string): string {
    const idPath = isNil(id) ? '' : `/${id}`
    return `/secured/${this.store.storeName}${idPath}`
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

  protected enableLogging(): boolean {
    return false
  }

  protected allowMultipleCalls(): boolean {
    return false
  }

  protected prepareResponse(body: ENTITY | ENTITY[], idParam?: string): any {
    return idParam ? [{...body, id: idParam}] : body
  }

  private fetchFunctionality(params: PARAMS, idParam?: string): Subscription | undefined {
    if (!this.shouldMakeCall()) {
      return undefined
    }
    const httpParams = this.getHttpParams(params)
    const matrixParams = this.assembleMatrixParams(this.getMatrixParams(params))
    const pathParams = this.getPathParams(params)
    const url = `${this.getBasePath(idParam)}${pathParams}${matrixParams}`
    const request$ = this.fetcher.get<ENTITY>(url, {params: httpParams}).pipe(
      tap((_) => this.logResults(_)),
      tap((body) => this.fetchSetStore(body, idParam)),
      catchError((error) => this.setStoreError(error))
    )
    return cacheable(this.store, request$).subscribe()
  }

  private shouldMakeCall() {
    return (!this.query.getValue().loading || this.allowMultipleCalls()) && this.prefetch()
  }

  private prefetch(): boolean {
    if (this.store.config?.cache?.ttl === 0) {
      this.removeCache()
    }
    if (!this.query.getHasCache()) {
      this.store.setLoading(true)
      this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
      return true
    }
    return false
  }

  protected setProcessingStatus(processingStatus: ProcessingStatus): void {}

  protected fetchSetStore(body: ENTITY | ENTITY[], idParam: string|undefined) {
    this.store.set(this.prepareResponse(body, idParam))
    this.store.setHasCache(true)
    this.store.setLoading(false)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected setStoreError(error: HttpErrorResponse) {
    this.store.setError(error)
    this.store.setLoading(false)
    this.store.setHasCache(false)
    this.setProcessingStatus(ProcessingStatus.FAILURE)
    return throwError(() => error)
  }


  private logResults(data: ENTITY) {
    return this.enableLogging() ? console.log(`${this.store.storeName}: `, data) : undefined
  }
}

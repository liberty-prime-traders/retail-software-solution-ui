import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {cacheable, EntityState, isNil, Store} from '@datorama/akita'
import {Observable, Subscription, throwError} from 'rxjs'
import {catchError, filter, map, tap} from 'rxjs/operators'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseModel} from '../base-api/base.model'
import {BaseQuery} from '../base-api/base.query'
import {BaseState} from '../base-api/base.state'
import {BaseStore} from '../base-api/base.store'
import {RtsHttpOptions} from './RtsHttpOptions'

export type PARAMS = RtsHttpOptions | undefined


/**
 * FetchService should declare the same type as the Store. FetchService will
 * look at the store's name to resolve the base path {@see getBasePath}.
 */

export abstract class FetchService<ENTITY extends BaseModel, STATE extends BaseState<ENTITY>> {
    paramSet = new Set<string>()

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
        this.paramSet.clear()
    }

    fetchById(idParam: string, additionalParams?: PARAMS) {
        return this.fetchFunctionality(additionalParams, idParam)
    }

    removeCacheFor(params: PARAMS) {
        this.paramSet.delete(JSON.stringify(this.memoizableParams(params)))
    }

    protected getBasePath(id?: string): string {
        const idPath = isNil(id) ? '' : `/${id}`
        return `/secured/${this.store.storeName}${idPath}`
    }

    protected createFn(response: any): any {
        return response
    }

    protected getMatrixParams(params: PARAMS): string {
        return ''
    }

    protected getPathParams(params: PARAMS): string {
        return params?.pathParams ?? ''
    }

    protected getHttpParams(params: PARAMS): RtsHttpOptions {
        return {}
    }

    protected memoizableParams(params: PARAMS) {
        return params
    }

    protected shouldMemoize(): boolean {
        return false
    }

    protected enableLogging(): boolean {
        return false
    }

    protected allowMultipleCalls(): boolean {
        return false
    }

    protected fetchSetStore(body: ENTITY | ENTITY[], idParam: string|undefined) {
        this.store.set(this.createFn(this.prepareResponse(body, idParam)))
        this.store.setHasCache(true)
        this.store.setLoading(false)
        this.setProcessingStatus(ProcessingStatus.SUCCESS)
    }

    protected prepareResponse(body: ENTITY | ENTITY[], idParam?: string): any {
        return idParam ? [{...body, id: idParam}] : body
    }

    private fetchFunctionality(params: PARAMS, idParam?: string): Subscription | undefined {
        if (this.query.getValue().loading && !this.allowMultipleCalls()) {
            return undefined
        }
        if (this.store.config?.cache?.ttl === 0) {
            this.removeCache()
        }
        if (this.shouldMemoize()) {
            this.memoizeStoreCache(this.store, this.memoizableParams({id: idParam, ...params}))
        }
        const httpParams = this.getHttpParams(params)
        const matrixParams = this.getMatrixParams(params)
        const pathParams = this.getPathParams(params)
        const url = `${this.getBasePath(idParam)}${pathParams}${matrixParams}`
        this.store.setLoading(!this.query.getHasCache())
        this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
        const request$ = this.fetcher.get<ENTITY>(url, httpParams).pipe(
            tap((_) => this.logResults(_)),
            tap((body) => this.fetchSetStore(body, idParam)),
            catchError((error) => {
                this.removeCacheFor(this.memoizableParams({id: idParam, ...params}))
                return this.setStoreError(error)
            })
        )
        return cacheable(this.store, request$).subscribe()
    }

    protected setProcessingStatus(processingStatus: ProcessingStatus): void {}

    protected setStoreError(error: HttpErrorResponse) {
        this.store.setError(error)
        this.store.setLoading(false)
        this.store.setHasCache(true)
        this.setProcessingStatus(ProcessingStatus.FAILURE)
        return throwError(() => error)
    }

    private memoizeStoreCache<S>(store: Store<EntityState>, params: S) {
        const paramsToJson = JSON.stringify(params)
        if (!this.paramSet.has(paramsToJson)) {
            store.setHasCache(false)
            this.paramSet.add(paramsToJson)
        }
    }

    private logResults(data: ENTITY) {
        return this.enableLogging() ? console.log(`${this.store.storeName}: `, data) : undefined
    }
}

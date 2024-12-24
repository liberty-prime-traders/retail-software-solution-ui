import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {inject} from '@angular/core'
import {isNil} from 'lodash-es'
import {Observable, Subscription} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {HttpMethod} from '../../utils/types/http-method.enum'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {FetchService} from '../util/fetch-service'
import {BaseModel} from './base.model'
import {BaseQuery} from './base.query'
import {BaseState} from './base.state'
import {BaseStore} from './base.store'

export abstract class BaseService<
  RESPONSE extends BaseModel,
  STATE extends BaseState<RESPONSE>,
  PAYLOAD = RESPONSE
> extends FetchService<RESPONSE, STATE> {
    private readonly httpClient = inject(HttpClient)
    saveStatus$ = () => this.query.selectSaveProcessingStatus()
    fetchStatus$ = () => this.query.selectFetchProcessingStatus()
    deleteStatus$ = () => this.query.selectDeleteProcessingStatus()
    failureMessage$ = () => this.query.selectErrorMessage()

    protected constructor(protected override readonly store: BaseStore<RESPONSE, STATE>,
                          protected override readonly query: BaseQuery<RESPONSE, STATE>) {
        super(store, query, inject(HttpClient))
    }

    resetProcessingStatus() {
        this.setSaveStatus(ProcessingStatus.IDLE)
        this.setDeleteStatus(ProcessingStatus.IDLE)
        this.setFetchStatus(ProcessingStatus.IDLE)
    }

    post(body?: PAYLOAD, id?: string): Subscription {
        this.store.setLoading(true)
        this.setSaveStatus(ProcessingStatus.UNDERWAY)
        return this.httpClient.post<RESPONSE>(this.getBasePath(id), body).pipe(
            first(),
            tap((postResult: RESPONSE) => this.finishSavingWithSuccess(postResult)),
            catchError((error: HttpErrorResponse) => this.setStoreError(error, HttpMethod.POST))
        )
            .subscribe()
    }

    put(body: PAYLOAD): Subscription {
        this.startSaving()
        return this.httpClient.put<RESPONSE>(this.getBasePath(), body).pipe(
            first(),
            tap((putResult: RESPONSE) => this.finishSavingWithSuccess(putResult)),
            catchError((error: HttpErrorResponse) => this.setStoreError(error, HttpMethod.PUT))
        )
            .subscribe()
    }

    delete(id: string): Subscription {
        this.store.setLoading(true)
        this.setDeleteStatus(ProcessingStatus.UNDERWAY)
        return this.httpClient.delete(this.getBasePath(id)).pipe(
            first(),
            tap(() => {
                this.store.remove(id)
                this.store.setLoading(false)
                this.setDeleteStatus(ProcessingStatus.SUCCESS)
            }),
            catchError((error: HttpErrorResponse) => this.setStoreError(error, HttpMethod.DELETE))
        )
            .subscribe()
    }

    startSaving() {
        this.store.setLoading(true)
        this.setSaveStatus(ProcessingStatus.UNDERWAY)
    }

    protected finishSavingWithSuccess(result: RESPONSE | RESPONSE[]) {
        if (Array.isArray(result)) {
            this.store.upsertMany(result)
        } else if (!isNil(result)) {
            this.store.upsert(result[this.store.idKey], result)
        }
        this.store.setLoading(false)
        this.setSaveStatus(ProcessingStatus.SUCCESS)
    }

    protected setSaveStatus(processingStatus: ProcessingStatus): void {
        this.store.setSaveStatus(processingStatus)
    }

    protected setDeleteStatus(processingStatus: ProcessingStatus): void {
        this.store.setDeleteStatus(processingStatus)
    }

    protected override setFetchStatus(processingStatus: ProcessingStatus): void {
        this.store.setFetchStatus(processingStatus)
    }

    protected override setStoreError(error: HttpErrorResponse, method?: HttpMethod): Observable<never> {
        if (method === HttpMethod.GET) {
            this.setFetchStatus(ProcessingStatus.FAILURE)
        } else if (method && [HttpMethod.POST, HttpMethod.PUT].includes(method)) {
            this.setSaveStatus(ProcessingStatus.FAILURE)
        } else {
            this.setDeleteStatus(ProcessingStatus.FAILURE)
        }
        return super.setStoreError(error)
    }
}

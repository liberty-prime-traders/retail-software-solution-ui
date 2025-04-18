import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {inject} from '@angular/core'
import {OrArray} from '@datorama/akita'
import {isNil} from 'lodash-es'
import {map, Observable, Subscription} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
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

  readonly processingStatus$ = () => this.query.selectProcessingStatus()
  readonly failureMessages$ = () => this.query.selectFailureMessages()
  readonly processingIsUnderWay$ = () => this.processingStatus$().pipe(
    map(status => status === ProcessingStatus.IN_PROGRESS)
  )

  protected constructor(protected override readonly store: BaseStore<RESPONSE, STATE>,
                          protected override readonly query: BaseQuery<RESPONSE, STATE>) {
    super(store, query, inject(HttpClient))
  }

  resetProcessingStatus() {
    this.setProcessingStatus(ProcessingStatus.IDLE)
  }

  post(body?: PAYLOAD, id?: string): Subscription {
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
    return this.httpClient.post<RESPONSE>(this.getBasePath(id), body).pipe(
      first(),
      tap((postResult: RESPONSE) => this.finishSavingWithSuccess(postResult)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error))
    )
      .subscribe()
  }

  put(body: PAYLOAD): Subscription {
    this.startSaving()
    return this.httpClient.put<RESPONSE>(this.getBasePath(), body).pipe(
      first(),
      tap((putResult: RESPONSE) => this.finishSavingWithSuccess(putResult)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error))
    )
      .subscribe()
  }

  delete(id?: string): Subscription {
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
    return this.httpClient.delete(this.getBasePath(id)).pipe(
      first(),
      tap(() => {
        this.store.remove(id)
        this.store.setLoading(false)
        this.setProcessingStatus(ProcessingStatus.SUCCESS)
      }),
      catchError((error: HttpErrorResponse) => this.setStoreError(error))
    )
      .subscribe()
  }

  startSaving() {
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
  }

  protected finishSavingWithSuccess(result: RESPONSE | RESPONSE[]) {
    if (Array.isArray(result)) {
      this.store.upsertMany(result)
    } else if (!isNil(result)) {
      this.store.upsert(result[this.store.idKey], result)
    }
    this.store.setLoading(false)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected override setProcessingStatus(processingStatus: ProcessingStatus): void {
    this.store.setProcessingStatus(processingStatus)
  }

  protected override setStoreError(error: HttpErrorResponse): Observable<never> {
    this.setProcessingStatus(ProcessingStatus.FAILURE)
    return super.setStoreError(error)
  }

  removeEntities(id?: OrArray<string>) {
    this.store.remove(id)
  }
}

import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {inject} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {finalize, Subscription} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {ApiCallbacks} from './api-callbacks'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'
import {FetchService} from './fetch-service'

export abstract class BaseService<RESPONSE extends BaseModel, PAYLOAD = Partial<RESPONSE>>
  extends FetchService<RESPONSE> {
  protected readonly httpClient = inject(HttpClient)

  protected constructor(protected override readonly store: BaseStore<RESPONSE>) {
    super(store, inject(HttpClient))
  }

  post(body?: PAYLOAD | PAYLOAD[], callbacks?: ApiCallbacks<RESPONSE>, id?: EntityId): Subscription {
    this.startApiRequest()
    return this.httpClient.post<RESPONSE>(this.getBasePath(id), body).pipe(
      first(),
      tap((result: RESPONSE) => {
        this.finishSavingWithSuccess(result)
        callbacks?.onSuccess?.(result)
      }),
      catchError((error: HttpErrorResponse) => {
        callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
      .subscribe()
  }

  put(body: PAYLOAD, callbacks?: ApiCallbacks<RESPONSE>): Subscription {
    this.startApiRequest()
    return this.httpClient.put<RESPONSE>(this.getBasePath(), body).pipe(
      first(),
      tap((result: RESPONSE) => {
        this.finishSavingWithSuccess(result)
        callbacks?.onSuccess?.(result)
      }),
      catchError((error: HttpErrorResponse) => {
        callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
      .subscribe()
  }

  putWithId(id: EntityId, callbacks?: ApiCallbacks<RESPONSE>): Subscription {
    this.startApiRequest()
    return this.httpClient.put<RESPONSE>(this.getBasePath(id), {}).pipe(
      first(),
      tap((result: RESPONSE) => {
        this.finishSavingWithSuccess(result)
        callbacks?.onSuccess?.(result)
      }),
      catchError((error: HttpErrorResponse) => {
        callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
      .subscribe()
  }

  delete(id?: EntityId): Subscription | undefined {
    if (!id) {
      return
    }
    this.startApiRequest()
    return this.httpClient.delete(this.getBasePath(id)).pipe(
      first(),
      tap(() => this.finishDeletingWithSuccess(id)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    )
      .subscribe()
  }
}

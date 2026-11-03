import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {inject} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {defer, finalize, Observable, Subscription} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {ApiCallbacks} from './api-callbacks'
import {ApiRequest} from './api-request.model'
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
    return this.postRequest({body, callbacks, id})
  }

  put(body: PAYLOAD, callbacks?: ApiCallbacks<RESPONSE>): Subscription {
    return this.putRequest({body, callbacks})
  }

  postRequest(apiRequest: ApiRequest<PAYLOAD, RESPONSE>): Subscription {
    const subscription = this.whenSessionReady(apiRequest.config, () => this.sendPost(apiRequest)).subscribe()
    return this.captureInFlight('POST', subscription)
  }

  putRequest(apiRequest: ApiRequest<PAYLOAD, RESPONSE>): Subscription {
    const subscription = this.whenSessionReady(apiRequest.config, () => this.sendPut(apiRequest)).subscribe()
    return this.captureInFlight('PUT', subscription)
  }

  delete(id?: EntityId): Subscription | undefined {
    return this.deleteRequest({id})
  }

  deleteRequest(apiRequest: ApiRequest<PAYLOAD, RESPONSE>): Subscription | undefined {
    if (!apiRequest.id) return
    const subscription = this.whenSessionReady(apiRequest.config, () => this.sendDelete(apiRequest)).subscribe()
    return this.captureInFlight('DELETE', subscription)
  }

  protected readonly applyInternalCallBacks = (
    internalCallbacks: ApiCallbacks<RESPONSE>,
    callbacks?: ApiCallbacks<RESPONSE>
  ) => {
    return {
      onSuccess: (result: RESPONSE) => {
        internalCallbacks.onSuccess?.(result)
        callbacks?.onSuccess?.(result)
      },
      onFail: (error: HttpErrorResponse) => {
        internalCallbacks.onFail?.(error)
        callbacks?.onFail?.(error)
      }
    }
  }

  private sendPost(apiRequest: ApiRequest<PAYLOAD, RESPONSE>): Observable<RESPONSE> {
    const url = this.getBasePath(apiRequest.id, apiRequest.config)
    return defer(() => {
      this.startApiRequest()
      return this.httpClient.post<RESPONSE>(url, apiRequest.body)
    }).pipe(
      first(),
      tap((result: RESPONSE) => {
        this.finishSavingWithSuccess(result, {config: apiRequest.config})
        apiRequest.callbacks?.onSuccess?.(result)
      }),
      catchError((error: HttpErrorResponse) => {
        apiRequest.callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
  }

  private sendPut(apiRequest: ApiRequest<PAYLOAD, RESPONSE>): Observable<RESPONSE> {
    const url = this.getBasePath(apiRequest.id, apiRequest.config)
    return defer(() => {
      this.startApiRequest()
      return this.httpClient.put<RESPONSE>(url, apiRequest.body)
    }).pipe(
      first(),
      tap((result: RESPONSE) => {
        this.finishSavingWithSuccess(result, {config: apiRequest.config})
        apiRequest.callbacks?.onSuccess?.(result)
      }),
      catchError((error: HttpErrorResponse) => {
        apiRequest.callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
  }

  private sendDelete(apiRequest: ApiRequest<PAYLOAD, RESPONSE>): Observable<RESPONSE> {
    const url = this.getBasePath(apiRequest.id, apiRequest.config)
    return defer(() => {
      this.startApiRequest()
      return this.httpClient.delete<RESPONSE>(url, {body: apiRequest.body})
    }).pipe(
      first(),
      tap((response) => {
        this.finishDeletingWithSuccess(apiRequest.id!)
        apiRequest.callbacks?.onSuccess?.(response)
      }),
      catchError((error: HttpErrorResponse) => {
        apiRequest.callbacks?.onFail?.(error)
        return this.setStoreError(error)
      }),
      finalize(() => this.finalizeApiRequest())
    )
  }
}

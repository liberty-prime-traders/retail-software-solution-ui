import {HttpErrorResponse, HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {finalize, Subscription, throwError} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {Purchase, PurchaseLineCancelDto} from './purchase.model'
import {PurchaseStore} from './purchase.store'

@Injectable({providedIn: 'root'})
export class PurchaseService extends BaseService<Purchase> {

  private readonly defaultLimit = 15

  constructor(protected override readonly store: PurchaseStore) {
    super(store)
  }

  override getHttpParams(): HttpParams {
    return new HttpParams().set('top', this.defaultLimit)
  }

  createDraft(body: Partial<Purchase>, callbacks?: ApiCallbacks<Purchase>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.post(body, callbacks)
  }

  updateDraft(body: Partial<Purchase>, callbacks?: ApiCallbacks<Purchase>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.put(body, callbacks)
  }

  createOrder(body: Partial<Purchase>, callbacks?: ApiCallbacks<Purchase>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'order'})
    return this.post(body, callbacks)
  }

  convertDraftToOrder(body: Partial<Purchase>, callbacks?: ApiCallbacks<Purchase>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'order'})
    return this.put(body, callbacks)
  }

  cancelLines(id: EntityId, lines: PurchaseLineCancelDto[], callbacks?: ApiCallbacks<Purchase>): Subscription {
    this.startApiRequest()
    return this.httpClient.put<Purchase>(`${this.getBasePath(id)}/line-cancel-quantities`, lines).pipe(
      first(),
      tap((result) => {
        this.finishSavingWithSuccess(result)
        callbacks?.onSuccess?.(result)
      }),
      catchError((error: HttpErrorResponse) => {
        this.setStoreError(error)
        callbacks?.onFail?.(error)
        return throwError(() => error)
      }),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }

  updateNotes(id: EntityId, notes: string): Subscription {
    this.startApiRequest()
    return this.httpClient.put<void>(`${this.getBasePath(id)}/notes`, {notes}).pipe(
      first(),
      tap(() => {
        this.setProcessingStatus(ProcessingStatus.SUCCESS)
        this.store.upsert({id, notes})
      }),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }
}

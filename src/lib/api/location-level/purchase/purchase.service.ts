import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
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
    this.patchApiRequestConfig({urlSuffix: 'line-cancel-quantities'})
    return this.putRequest({body: lines as any, callbacks, id})
  }

  updateNotes(id: EntityId, notes: string): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'notes'})
    return this.putRequest({body: {notes} as any, id})
  }
}

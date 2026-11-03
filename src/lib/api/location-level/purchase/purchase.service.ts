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
    return this.postRequest({body, callbacks, config: {urlSuffix: 'draft'}})
  }

  updateDraft(body: Partial<Purchase>, callbacks?: ApiCallbacks<Purchase>): Subscription {
    return this.putRequest({body, callbacks, config: {urlSuffix: 'draft'}})
  }

  createOrder(body: Partial<Purchase>, callbacks?: ApiCallbacks<Purchase>): Subscription {
    return this.postRequest({body, callbacks, config: {urlSuffix: 'order'}})
  }

  convertDraftToOrder(body: Partial<Purchase>, callbacks?: ApiCallbacks<Purchase>): Subscription {
    return this.putRequest({body, callbacks, config: {urlSuffix: 'order'}})
  }

  cancelLines(id: EntityId, lines: PurchaseLineCancelDto[], callbacks?: ApiCallbacks<Purchase>): Subscription {
    return this.putRequest({body: lines as any, callbacks, id, config: {urlSuffix: 'line-cancel-quantities'}})
  }

  updateNotes(id: EntityId, notes: string): Subscription {
    return this.putRequest({body: {notes} as any, id, config: {urlSuffix: 'notes'}})
  }
}

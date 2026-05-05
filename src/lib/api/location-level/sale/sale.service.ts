import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {Sale} from './sale.model'
import {SaleStore} from './sale.store'

@Injectable({providedIn: 'root'})
export class SaleService extends BaseService<Sale> {

  constructor(protected override readonly store: SaleStore) {
    super(store)
  }

  createDraft(body: Partial<Sale>, callbacks?: ApiCallbacks<Sale>) {
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.post(body, callbacks)
  }

  updateDraft(body: Partial<Sale>, callbacks?: ApiCallbacks<Sale>) {
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.put(body, callbacks)
  }

  createSale(body: Partial<Sale>, callbacks?: ApiCallbacks<Sale>) {
    this.patchApiRequestConfig({urlSuffix: 'complete'})
    return this.post(body, callbacks)
  }

  voidSale(id: EntityId, callbacks?: ApiCallbacks<Sale>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'void'})
    return this.putRequest({id, callbacks})
  }

  convertDraftToSale(body: Partial<Sale>, callbacks?: ApiCallbacks<Sale>) {
    this.patchApiRequestConfig({urlSuffix: 'complete'})
    return this.put(body, callbacks)
  }

  updateNotes(id: EntityId, notes: string): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'notes'})
    return this.putRequest({body: {notes} as any, id})
  }
}

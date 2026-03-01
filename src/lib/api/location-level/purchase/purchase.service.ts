import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Purchase} from './purchase.model'
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
}

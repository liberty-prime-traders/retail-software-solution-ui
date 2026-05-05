import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {SalePayment, SalePaymentVoidRequest} from './sale-payment.model'
import {SalePaymentStore} from './sale-payment.store'

@Injectable({providedIn: 'root'})
export class SalePaymentService extends BaseService<SalePayment, Partial<SalePayment>> {

  constructor(protected override readonly store: SalePaymentStore) {
    super(store)
  }

  voidPayment(dto: SalePaymentVoidRequest, callbacks?: ApiCallbacks<SalePayment>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'void'})
    return this.post(dto as any, callbacks)
  }
}

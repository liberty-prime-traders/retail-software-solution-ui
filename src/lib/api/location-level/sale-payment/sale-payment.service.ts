import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {SalePayment} from './sale-payment.model'
import {SalePaymentStore} from './sale-payment.store'

@Injectable({providedIn: 'root'})
export class SalePaymentService extends BaseService<SalePayment, Partial<SalePayment>> {

  constructor(protected override readonly store: SalePaymentStore) {
    super(store)
  }
}

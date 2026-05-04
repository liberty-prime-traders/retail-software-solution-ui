import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SalePayment} from './sale-payment.model'

@Injectable({providedIn: 'root'})
export class SalePaymentStore extends createBaseStore<SalePayment>()
  implements BaseStore<SalePayment> {
  readonly basePath = 'sale-payments'
}

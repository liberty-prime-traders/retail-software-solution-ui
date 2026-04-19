import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SupplierPayment} from './supplier-payment.model'

@Injectable({providedIn: 'root'})
export class SupplierPaymentStore extends createBaseStore<SupplierPayment>() implements BaseStore<SupplierPayment> {
  readonly basePath = 'supplier-payments'
}

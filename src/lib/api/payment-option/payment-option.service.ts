import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {PaymentOption} from './payment-option.model.'
import {PaymentOptionStore} from './payment-option.store'

@Injectable({providedIn: 'root'})
export class PaymentOptionService extends BaseService<PaymentOption> {
  constructor(protected override readonly store: PaymentOptionStore) {
    super(store)
  }
}

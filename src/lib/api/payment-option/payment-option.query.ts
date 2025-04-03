import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {PaymentOption} from './payment-option.model.'
import {PaymentOptionState} from './payment-option.state'
import {PaymentOptionStore} from './payment-option.store'

@Injectable({providedIn: 'root'})
export class PaymentOptionQuery extends BaseQuery<PaymentOption, PaymentOptionState> {
  constructor(protected override readonly store: PaymentOptionStore) {
    super(store)
  }
}

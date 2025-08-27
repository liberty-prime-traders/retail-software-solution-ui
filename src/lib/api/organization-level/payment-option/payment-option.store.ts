import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {PaymentOption} from './payment-option.model.'

@Injectable({providedIn: 'root'})
export class PaymentOptionStore extends createBaseStore<PaymentOption>() implements BaseStore<PaymentOption> {
  basePath = 'payment-methods'
}

import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {BaseStore} from '../base-api/base.store'
import {PaymentOption} from './payment-option.model.'
import {PaymentOptionState} from './payment-option.state'
import {createInitialState} from '../base-api/base.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'payment-methods'})
export class PaymentOptionStore extends BaseStore<PaymentOption, PaymentOptionState> {
  constructor() {
    super(createInitialState())
  }
}

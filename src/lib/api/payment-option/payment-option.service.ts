import {Injectable} from "@angular/core";
import {BaseService} from "../base-api/base.service";
import {PaymentOption} from "./payment-option.model.";
import {PaymentOptionState} from "./payment-option.state";
import {PaymentOptionStore} from "./payment-option.store";
import {PaymentOptionQuery} from "./payment-option.query";

@Injectable({providedIn: 'root'})
export class PaymentOptionService extends BaseService<PaymentOption, PaymentOptionState> {
  constructor(protected override readonly store: PaymentOptionStore,
              protected override readonly query: PaymentOptionQuery) {
    super(store, query)
  }
}

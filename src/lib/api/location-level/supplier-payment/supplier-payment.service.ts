import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {SupplierPayment, SupplierPaymentVoidRequest} from './supplier-payment.model'
import {SupplierPaymentStore} from './supplier-payment.store'

@Injectable({providedIn: 'root'})
export class SupplierPaymentService extends MultimapBaseService<SupplierPayment> {
  protected override keyPath: keyof SupplierPayment = 'purchaseId'

  constructor(protected override readonly store: SupplierPaymentStore) {
    super(store)
  }

  voidPayment(dto: SupplierPaymentVoidRequest, callbacks?: ApiCallbacks<SupplierPayment>) {
    this.patchApiRequestConfig({urlSuffix: 'void'})
    return this.post(dto as any, callbacks)
  }
}

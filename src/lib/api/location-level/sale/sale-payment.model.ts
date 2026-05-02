import {EntityId} from '@ngrx/signals/entities'

export interface SalePayment {
  fakeId?: number
  saleId: string,
  paymentMethodId: EntityId,
  paymentMethodName: string,
  amount: number,
  reference?: string,
  paymentDate?: string
}

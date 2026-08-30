import {PaymentStatus} from '../purchase/payment-status.enum'
import {SaleStatus} from '../sale-summary/sale-status.enum'
import {SaleSession} from './sale-session.model'

export const defaultSaleSession = (): SaleSession => {
  return {
    ids: [],
    entityMap: {},
    id: '',
    createdBy: '',
    lastUpdatedAt: '',
    lastAccessedBy: '',
    lastAccessedAt: '',
    contactId: '',
    contactLabel: '',
    walkInCustomer: null,
    soldBy: '',
    saleStatus: SaleStatus.DRAFT,
    paymentStatus: PaymentStatus.UNPAID,
    dateSold: '',
    notes: '',
    saleLines: [],
    saleAdjustments: [],
    salePayments: [],
    totals: {
      subtotal: 0,
      lineLevelDiscountTotal: 0,
      orderLevelDiscountTotal: 0,
      lineLevelSurchargeTotal: 0,
      orderLevelSurchargeTotal: 0,
      paymentTotal: 0,
      payableTotal: 0,
      balance: 0,
    },
    uiOptions: {
      canMakeChangesToTheSale: false,
      canAddPaymentsToSale: false,
      showActiveUserWarning: false,
      showUnreservedChangesWarning: false
    },
  }
}

import {disabled, required, schema} from '@angular/forms/signals'
import {PaymentStatus} from '../../../../../api/location-level/purchase/payment-status.enum'
import {PurchaseStatus} from '../../../../../api/location-level/purchase/purchase-status.enum'
import {Purchase} from '../../../../../api/location-level/purchase/purchase.model'

export namespace PurchaseGeneralFieldsFormDefinition {
  export interface PurchaseGeneralFieldsModel {
    id: string
    referenceNumber: string
    supplierId: string
    supplierName: string
    dateOrdered: Date | null
    orderedBy: string
    orderedById: string
    notes: string
    purchaseStatus: PurchaseStatus
    createdBy: string
    paymentStatus: PaymentStatus
    orderedTotal: number
  }

  export const fieldMap = new Map<keyof PurchaseGeneralFieldsModel, string>([
    ['supplierId', 'Supplier'],
    ['dateOrdered', 'Date Ordered'],
    ['orderedBy', 'Ordered By'],
    ['notes', 'Notes']
  ])

  export const createDefaultPurchaseGeneralFieldsFormModel = (): PurchaseGeneralFieldsModel => ({
    id: '',
    referenceNumber: '',
    supplierId: '',
    supplierName: '',
    dateOrdered: null,
    orderedBy: '',
    orderedById: '',
    notes: '',
    purchaseStatus: PurchaseStatus.DRAFT,
    createdBy: '',
    paymentStatus: PaymentStatus.UNPAID,
    orderedTotal: 0
  })


  export const purchaseGeneralFieldsFormSchema = schema<PurchaseGeneralFieldsModel>((path) => {
    required(path.supplierId)

    const isReadOnly = ({valueOf}: any) => {
      const purchaseStatus = valueOf(path.purchaseStatus)
      return purchaseStatus && purchaseStatus !== PurchaseStatus.DRAFT
    }
    disabled(path.supplierId, isReadOnly)
    disabled(path.dateOrdered, isReadOnly)
    disabled(path.orderedById, isReadOnly)
  })

  export const convertToFormModel = (purchase: Purchase | null): PurchaseGeneralFieldsModel => ({
    id: purchase?.id as string ?? '',
    referenceNumber: purchase?.referenceNumber ?? '',
    supplierId: purchase?.supplierId ?? '',
    supplierName: purchase?.supplierName ?? '',
    dateOrdered: purchase?.dateOrdered ? new Date(purchase.dateOrdered) : null,
    orderedBy: purchase?.orderedBy ?? '',
    orderedById: purchase?.orderedById ?? '',
    notes: purchase?.notes ?? '',
    purchaseStatus: purchase?.purchaseStatus ?? PurchaseStatus.DRAFT,
    createdBy: purchase?.createdBy ?? '',
    paymentStatus: purchase?.paymentStatus ?? PaymentStatus.UNPAID,
    orderedTotal: purchase?.orderedTotal ?? 0
  })

  export const convertToBackendModel = (formValue: PurchaseGeneralFieldsModel): Partial<Purchase> => ({
    id: formValue.id,
    supplierId: formValue.supplierId,
    dateOrdered: formValue.dateOrdered?.toISOString(),
    orderedById: formValue.orderedById,
    notes: formValue.notes
  })
}

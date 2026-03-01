import {required, schema, SchemaPathTree} from '@angular/forms/signals'
import {PurchaseStatus} from '../../../../../api/location-level/purchase/purchase-status.enum'
import {Purchase} from '../../../../../api/location-level/purchase/purchase.model'

export namespace PurchaseGeneralFieldsFormDefinition {
  export interface PurchaseGeneralFieldsModel {
    id: string
    referenceNumber: string
    supplierId: string
    supplierName: string
    dateOrdered: string
    orderedBy: string
    orderedById: string
    notes: string
    status: PurchaseStatus
    createdBy: string
    createdOn: string
    orderTotal: number
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
    dateOrdered: '',
    orderedBy: '',
    orderedById: '',
    notes: '',
    status: PurchaseStatus.DRAFT,
    createdBy: '',
    createdOn: '',
    orderTotal: 0
  })

  export const purchaseGeneralFieldsFormSchema = schema<PurchaseGeneralFieldsModel>((path) => {
    required(path.supplierId)
  })

  export const convertToFormModel = (purchase: Purchase | undefined): PurchaseGeneralFieldsModel => ({
    id: purchase?.id as string ?? '',
    referenceNumber: purchase?.referenceNumber ?? '',
    supplierId: purchase?.supplierId ?? '',
    supplierName: purchase?.supplierName ?? '',
    dateOrdered: purchase?.dateOrdered ?? '',
    orderedBy: purchase?.orderedBy ?? '',
    orderedById: purchase?.orderedById ?? '',
    notes: purchase?.notes ?? '',
    status: purchase?.status ?? PurchaseStatus.DRAFT,
    createdBy: purchase?.createdBy ?? '',
    createdOn: purchase?.createdOn ?? '',
    orderTotal: purchase?.totalAmount ?? 0
  })

  export const convertToBackendModel = (formValue: PurchaseGeneralFieldsModel): Partial<Purchase> => ({
    id: formValue.id,
    supplierId: formValue.supplierId,
    dateOrdered: formValue.dateOrdered,
    orderedById: formValue.orderedById,
    notes: formValue.notes
  })
}

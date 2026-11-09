import {min, required, schema} from '@angular/forms/signals'
import {PurchaseDeliveryLine} from '../../../../api/location-level/delivery/purchase-delivery.model'
import {
  DeliveryLineRevisionRequest
} from '../../../../api/location-level/delivery-revision/delivery-line-revision-request.model'

export namespace DeliveryLineRevisionFormDefinition {

  export interface DeliveryLineRevisionFormModel {
    userProvidedQuantityDelivered: number | null
    unitId: string
    unitCost: number | null
    reason: string
  }

  export const fieldMap = new Map<keyof DeliveryLineRevisionFormModel, string>([
    ['userProvidedQuantityDelivered', 'New Quantity'],
    ['unitId', 'Unit'],
    ['unitCost', 'New Unit Cost'],
    ['reason', 'Reason']
  ])

  export const deliveryLineRevisionFormSchema = schema<DeliveryLineRevisionFormModel>((path) => {
    required(path.unitId)
    required(path.userProvidedQuantityDelivered)
    min(path.userProvidedQuantityDelivered, 0)
    required(path.unitCost)
    min(path.unitCost, 0)
    required(path.reason)
  })

  export const createDefault = (deliveryLine: PurchaseDeliveryLine): DeliveryLineRevisionFormModel => ({
    userProvidedQuantityDelivered: deliveryLine.quantityDelivered,
    unitId: deliveryLine.unitId,
    unitCost: deliveryLine.unitCost,
    reason: ''
  })

  export const toRequest = (
    deliveryLine: PurchaseDeliveryLine, formValue: DeliveryLineRevisionFormModel
  ): DeliveryLineRevisionRequest => ({
    revisedDeliveryLineId: deliveryLine.id!,
    userProvidedQuantityDelivered: formValue.userProvidedQuantityDelivered!,
    unitId: formValue.unitId,
    unitCost: formValue.unitCost!,
    reason: formValue.reason.trim()
  })
}

import {EntityId} from '@ngrx/signals/entities'

export interface DeliveryLineRevisionRequest {
  revisedDeliveryLineId: EntityId
  userProvidedQuantityDelivered: number
  unitId: string
  unitCost: number
  reason: string
}

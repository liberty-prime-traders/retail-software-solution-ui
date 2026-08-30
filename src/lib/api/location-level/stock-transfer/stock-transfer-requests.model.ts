import {EntityId} from '@ngrx/signals/entities'

export interface StockTransferCreateRequest {
  destinationLocationId: string
  notes?: string
}

export interface StockTransferLineRequest {
  additions: StockTransferLineAddRequest[]
  updates: StockTransferLineUpdateRequest[]
}

export interface StockTransferLineAddRequest {
  locationProductId: EntityId
  quantityDispatched: number
  unitId?: string
}

export interface StockTransferLineUpdateRequest {
  lineRef: string
  quantityDispatched?: number
  unitId?: string
}

import {required, schema} from '@angular/forms/signals'

export namespace StockTransferCreateFormDefinition {
  export interface StockTransferCreateFormModel {
    destinationLocationId: string
    notes: string
  }

  export const fieldMap = new Map<keyof StockTransferCreateFormModel, string>([
    ['destinationLocationId', 'Destination Location'],
    ['notes', 'Notes']
  ])

  export const defaultStockTransferCreateFormModel: StockTransferCreateFormModel = {
    destinationLocationId: '',
    notes: ''
  }

  export const stockTransferCreateFormSchema = schema<StockTransferCreateFormModel>((path) => {
    required(path.destinationLocationId)
  })
}

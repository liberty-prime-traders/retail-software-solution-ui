import {disabled, min, required, schema} from '@angular/forms/signals'
import {StockAdjustmentCategory} from '../../../../api/location-level/stock-adjustment/stock-adjustment-category.enum'
import {StockAdjustmentDirection} from '../../../../api/location-level/stock-adjustment/stock-adjustment-direction.enum'
import {StockAdjustment} from '../../../../api/location-level/stock-adjustment/stock-adjustment.model'

export namespace StockAdjustmentFormDefinition {
  export interface StockAdjustmentFormModel {
    locationProductId: string
    productLabel: string
    baseUnitId: string
    category: StockAdjustmentCategory | ''
    unitCostDirections: StockAdjustmentDirection[]
    requiresReason: boolean
    requiresNote: boolean
    direction: StockAdjustmentDirection | ''
    unitId: string
    quantity: number | null
    unitCost: number | null
    stockMovementReasonId: string
    note: string
  }

  export const requiresUnitCost = (
    unitCostDirections: StockAdjustmentDirection[],
    direction: StockAdjustmentDirection | ''
  ): boolean => direction !== '' && unitCostDirections.includes(direction)

  export const fieldMap = new Map<keyof StockAdjustmentFormModel, string>([
    ['locationProductId', 'Product'],
    ['category', 'Category'],
    ['direction', 'Direction'],
    ['unitId', 'Unit'],
    ['quantity', 'Quantity'],
    ['unitCost', 'Unit Cost'],
    ['stockMovementReasonId', 'Reason'],
    ['note', 'Note']
  ])

  export const defaultStockAdjustmentFormModel: StockAdjustmentFormModel = {
    locationProductId: '',
    productLabel: '',
    baseUnitId: '',
    category: '',
    unitCostDirections: [],
    requiresReason: false,
    requiresNote: false,
    direction: '',
    unitId: '',
    quantity: null,
    unitCost: null,
    stockMovementReasonId: '',
    note: ''
  }

  export const stockAdjustmentFormSchema = schema<StockAdjustmentFormModel>((path) => {
    required(path.locationProductId)
    required(path.category)
    required(path.direction)
    required(path.unitId)
    required(path.quantity)
    min(path.quantity, 0.0001)
    required(path.unitCost, {when: ({valueOf}) => requiresUnitCost(valueOf(path.unitCostDirections), valueOf(path.direction))})
    required(path.note, {when: ({valueOf}) => valueOf(path.requiresNote)})
    required(path.stockMovementReasonId, {when: ({valueOf}) => valueOf(path.requiresReason)})
    disabled(path.unitId, {when: ({valueOf}) => !valueOf(path.locationProductId)})
  })

  export const convertToBackendModel = (formValue: StockAdjustmentFormModel): Partial<StockAdjustment> => {
    return {
      locationProductId: formValue.locationProductId,
      category: formValue.category as StockAdjustmentCategory,
      direction: formValue.direction as StockAdjustmentDirection,
      quantity: formValue.quantity!,
      unitId: formValue.unitId,
      unitCost: requiresUnitCost(formValue.unitCostDirections, formValue.direction) ? formValue.unitCost! : undefined,
      stockMovementReasonId: formValue.requiresReason ? formValue.stockMovementReasonId : undefined,
      note: formValue.note.trim() || undefined
    }
  }
}

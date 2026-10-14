import {minLength, required, schema} from '@angular/forms/signals'
import {MovementType} from '../../../../api/organization-level/stock-movement-reason/movement-type.enum'
import {StockMovementReason} from '../../../../api/organization-level/stock-movement-reason/stock-movement-reason.model'

export namespace StockMovementReasonFormDefinition {
  export interface StockMovementReasonFormModel {
    id: string
    name: string
    description: string
    movementTypes: MovementType[]
  }

  export const fieldMap = new Map<keyof StockMovementReasonFormModel, string>([
    ['name', 'Name'],
    ['description', 'Description'],
    ['movementTypes', 'Movement Types']
  ])

  export const defaultFormModel: StockMovementReasonFormModel = {
    id: '',
    name: '',
    description: '',
    movementTypes: []
  }

  export const formSchema = schema<StockMovementReasonFormModel>((path) => {
    required(path.name)
    minLength(path.movementTypes, 1)
  })

  export const convertToFormModel = (entity?: StockMovementReason): StockMovementReasonFormModel => ({
    id: entity?.id as string ?? '',
    name: entity?.name ?? '',
    description: entity?.description ?? '',
    movementTypes: entity?.movementTypes ?? []
  })

  export const convertToBackendModel = (formValue: StockMovementReasonFormModel): Partial<StockMovementReason> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    description: formValue.description,
    movementTypes: formValue.movementTypes
  })
}

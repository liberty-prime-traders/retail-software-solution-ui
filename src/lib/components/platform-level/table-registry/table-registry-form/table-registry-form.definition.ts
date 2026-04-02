import {required, schema} from '@angular/forms/signals'
import {TableRegistry} from '../../../../api/platform-level/table-registry/table-registry.model'

export namespace TableRegistryFormDefinition {
  export interface TableRegistryFormModel {
    id: string
    displayName: string
    defaultPrefix: string
    description: string
    userFacing: boolean
  }

  export const fieldMap = new Map<keyof TableRegistryFormModel, string>(
    [
      ['displayName', 'Display Name'],
      ['defaultPrefix', 'Default Prefix'],
      ['description', 'Description'],
      ['userFacing', 'User Facing']
    ]
  )

  export const defaultTableRegistryFormModel: TableRegistryFormModel = {
    id: '',
    displayName: '',
    defaultPrefix: '',
    description: '',
    userFacing: false
  }

  export const tableRegistryFormSchema = schema<TableRegistryFormModel>(path => {
    required(path.displayName)
    required(path.defaultPrefix)
    required(path.description)
  })

  export const convertToFormModel = (registry?: TableRegistry): TableRegistryFormModel => ({
    id: registry?.id as string ?? '',
    displayName: registry?.displayName ?? '',
    defaultPrefix: registry?.defaultPrefix ?? '',
    description: registry?.description ?? '',
    userFacing: registry?.userFacing ?? false
  })

  export const convertToBackendModel = (
    formValue: TableRegistryFormModel
  ): Partial<TableRegistry> => ({
    id: formValue.id || undefined,
    displayName: formValue.displayName,
    defaultPrefix: formValue.defaultPrefix,
    description: formValue.description,
    userFacing: formValue.userFacing
  })
}

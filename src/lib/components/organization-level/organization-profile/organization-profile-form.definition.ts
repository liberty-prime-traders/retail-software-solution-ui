import {required, schema} from '@angular/forms/signals'
import {Organization} from '../../../api/platform-level/organization/organization.model'

export namespace OrganizationProfileFormDefinition {
  export interface OrganizationProfileFormModel {
    id: string
    name: string
    description: string
  }

  export const fieldMap = new Map<keyof OrganizationProfileFormModel, string>(
    [
      ['name', 'Name'],
      ['description', 'Description']
    ]
  )

  export const defaultOrganizationProfileFormModel: OrganizationProfileFormModel = {
    id: '',
    name: '',
    description: ''
  }

  export const organizationProfileFormSchema = schema<OrganizationProfileFormModel>(path => {
    required(path.name)
  })

  export const convertToFormModel = (
    organization?: Organization | null
  ): OrganizationProfileFormModel => ({
    id: organization?.id as string ?? '',
    name: organization?.name ?? '',
    description: organization?.description ?? ''
  })

  export const convertToBackendModel = (
    formValue: OrganizationProfileFormModel
  ): Partial<Organization> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    description: formValue.description
  })
}

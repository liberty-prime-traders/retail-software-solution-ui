import {pattern, required, schema} from '@angular/forms/signals'
import {Organization} from '../../../api/platform-level/organization/organization.model'
import {Patterns} from '../../../utils/patterns'

export namespace CreateOrganizationFormDefinition {
  export interface CreateOrganizationFormModel {
    name: string
    description: string
    subdomain: string
    passCode: string
  }

  export const fieldMap = new Map<keyof CreateOrganizationFormModel, string>([
    ['name', 'Name'],
    ['description', 'Description'],
    ['subdomain', 'Domain'],
    ['passCode', 'Pass Code'],
  ])

  export const defaultFormModel: CreateOrganizationFormModel = {
    name: '',
    description: '',
    subdomain: '',
    passCode: '',
  }

  export const formSchema = schema<CreateOrganizationFormModel>((path) => {
    required(path.name)
    required(path.subdomain)
    required(path.passCode)
    pattern(path.passCode, Patterns.UUID, {message: 'Pass Code must be a valid UUID'})
  })

  export const convertToBackendModel = (formValue: CreateOrganizationFormModel): Partial<Organization> => ({
    name: formValue.name,
    description: formValue.description,
    subdomain: formValue.subdomain,
    passCode: formValue.passCode,
  })
}

import {required, schema} from '@angular/forms/signals'
import {JobTitle} from '../../../../api/organization-level/jobtitle/jobtitle.model'

export namespace JobTitleFormDefinition {
  export interface JobTitleFormModel {
    id: string
    value: string
  }

  export const fieldMap = new Map<keyof JobTitleFormModel, string>(
    [
      ['value', 'Value']
    ]
  )

  export const defaultJobTitleFormModel: JobTitleFormModel = {
    id: '',
    value: ''
  }

  export const jobTitleFormSchema = schema<JobTitleFormModel>(path => {
    required(path.value)
  })

  export const convertToFormModel = (jobTitle?: JobTitle): JobTitleFormModel => ({
    id: jobTitle?.id as string ?? '',
    value: jobTitle?.value ?? ''
  })

  export const convertToBackendModel = (formValue: JobTitleFormModel): Partial<JobTitle> => ({
    id: formValue.id || undefined,
    value: formValue.value
  })
}

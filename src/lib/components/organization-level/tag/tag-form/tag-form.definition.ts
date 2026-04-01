import {required, schema} from '@angular/forms/signals'
import {CategoryType} from '../../../../api/organization-level/tag/category-type.enum'
import {Tag} from '../../../../api/organization-level/tag/tag.model'

export namespace TagFormDefinition {
  export interface TagFormModel {
    id: string
    tagName: string
    description: string
    category: CategoryType | ''
  }

  export const fieldMap = new Map<keyof TagFormModel, string>(
    [
      ['tagName', 'Tag Name'],
      ['category', 'Category'],
      ['description', 'Description']
    ]
  )

  export const defaultTagFormModel: TagFormModel = {
    id: '',
    tagName: '',
    description: '',
    category: ''
  }

  export const tagFormSchema = schema<TagFormModel>(path => {
    required(path.tagName)
    required(path.category)
  })

  export const convertToFormModel = (tag?: Tag): TagFormModel => ({
    id: tag?.id as string ?? '',
    tagName: tag?.tagName ?? '',
    description: tag?.description ?? '',
    category: tag?.category ?? ''
  })

  export const convertToBackendModel = (formValue: TagFormModel): Partial<Tag> => ({
    id: formValue.id || undefined,
    tagName: formValue.tagName,
    description: formValue.description,
    category: formValue.category || undefined
  })
}

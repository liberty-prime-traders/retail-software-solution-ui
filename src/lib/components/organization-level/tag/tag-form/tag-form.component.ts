import {NgClass} from '@angular/common'
import {Component, effect, inject, input, output, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {Tag} from '../../../../api/organization-level/tag/tag.model'
import {TagService} from '../../../../api/organization-level/tag/tag.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {CategoryType} from '../../../../api/organization-level/tag/category-type.enum'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {TagFormDefinition} from './tag-form.definition'


@Component({
  selector: 'rts-tag-form',
  templateUrl: 'tag-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    Select,
    FormFieldComponent,
    FormField,
    EnumToDropdownPipe,
    NgClass
  ]
})
export class TagFormComponent extends BaseFormComponent<TagService> {
  readonly tag = input<Tag>()

  private readonly tagService = inject(TagService)
  protected readonly apiService = this.tagService

  readonly tagCreated = output<Tag>()

  readonly categoryType = CategoryType

  readonly tagFormModel = signal<TagFormDefinition.TagFormModel>(
    TagFormDefinition.defaultTagFormModel
  )
  readonly tagForm = form(
    this.tagFormModel,
    TagFormDefinition.tagFormSchema
  )
  readonly tagFieldMap = TagFormDefinition.fieldMap

  constructor() {
    super()
    effect(() => {
      const current = this.tag()
      untracked(() => {
        this.tagFormModel.set(
          TagFormDefinition.convertToFormModel(current)
        )
      })
    })
  }

  resetForm() {
    this.tagFormModel.set(
      TagFormDefinition.convertToFormModel(this.tag())
    )
  }

  upsertTag() {
    const updatedTag = TagFormDefinition.convertToBackendModel(this.tagFormModel())
    if (!updatedTag.id) {
      this.tagService.post(updatedTag, {onSuccess: (saved) => this.tagCreated.emit(saved)})
    } else {
      this.tagService.put(updatedTag)
    }
  }

  deleteTag() {
    this.tagService.delete(this.tag()?.id)
  }
}

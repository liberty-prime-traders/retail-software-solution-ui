import {NgClass} from '@angular/common'
import {Component, computed, inject, input} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {Tag} from '../../../../api/organization-level/tag/tag.model'
import {TagService} from '../../../../api/organization-level/tag/tag.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {CategoryType} from '../../../../api/organization-level/tag/category-type.enum'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'


@Component({
  selector: 'rts-tag-form',
  templateUrl: 'tag-form.component.html',
  imports: [
    FormButtonsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Select,
    FormFieldComponent,
    EnumToDropdownPipe,
    NgClass
  ]
})
export class TagFormComponent extends BaseFormComponent<TagService> {
  readonly tag = input<Tag>()

  private readonly tagService = inject(TagService)
  private readonly formBuilder = inject(FormBuilder)
  protected readonly apiService = this.tagService

  readonly categoryType = CategoryType

  readonly tagForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.tag()?.id,
    tagName: [this.tag()?.tagName, Validators.required],
    description: this.tag()?.description,
    category: [this.tag()?.category, Validators.required]
  }))

  resetForm() {
    this.tagForm().reset(this.tag())
  }

  upsertTag() {
    const updatedTag: Partial<Tag> = {...this.tagForm().getRawValue()}
    if (isNil(updatedTag.id)) {
      this.tagService.post(updatedTag)
    } else {
      this.tagService.put(updatedTag)
    }
    this.savedAtLeastOnce.set(true)
  }

  deleteTag() {
    this.tagService.delete(this.tag()?.id)
  }
}

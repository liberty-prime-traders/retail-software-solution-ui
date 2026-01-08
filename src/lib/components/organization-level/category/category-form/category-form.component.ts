import {NgClass} from '@angular/common'
import {Component, computed, inject, input} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {CategoryType} from '../../../../api/organization-level/category/category-type.enum'
import {Category} from '../../../../api/organization-level/category/category.model'
import {CategoryService} from '../../../../api/organization-level/category/category.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'


@Component({
  selector: 'rts-category-form',
  templateUrl: 'category-form.component.html',
  imports: [
    FormButtonsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    EnumToDropdownPipe,
    Select,
    FormFieldComponent,
    NgClass
  ]
})
export class CategoryFormComponent extends BaseFormComponent<CategoryService> {
  readonly category = input<Category>()

  private readonly categoryService = inject(CategoryService)
  private readonly formBuilder = inject(FormBuilder)
  protected readonly apiService = this.categoryService

  readonly categoryForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.category()?.id,
    categoryName: [this.category()?.categoryName, Validators.required],
    description: this.category()?.description,
    categoryType: [this.category()?.categoryType, Validators.required]
  }))

  readonly categoryType = CategoryType

  resetForm() {
    this.categoryForm().reset(this.category())
  }

  upsertCategory() {
    const updatedCategory: Partial<Category> = {...this.categoryForm().getRawValue()}
    if (isNil(updatedCategory.id)) {
      this.categoryService.post(updatedCategory)
    } else {
      this.categoryService.put(updatedCategory)
    }
    this.savedAtLeastOnce.set(true)
  }

  deleteCategory() {
    this.categoryService.delete(this.category()?.id)
  }
}

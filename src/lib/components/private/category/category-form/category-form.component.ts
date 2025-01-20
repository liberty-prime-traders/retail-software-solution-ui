import {Component, computed, inject, input, OnInit} from '@angular/core'
import {AsyncPipe} from '@angular/common'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {InputText} from 'primeng/inputtext'
import {DropdownModule} from 'primeng/dropdown'
import {Select} from 'primeng/select'
import {isNil} from 'lodash-es'
import {Category} from '../../../../api/category/category.model'
import {CategoryService} from '../../../../api/category/category.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {CategoryType} from '../../../../api/category/category-type.enum'


@Component({
  standalone: true,
  selector: 'rts-category-form',
  templateUrl: 'category-form.component.html',
  imports: [
    AsyncPipe,
    FormButtonsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    DropdownModule,
    EnumToDropdownPipe,
    Select
  ]
})
export class CategoryFormComponent implements OnInit {
  readonly category = input<Category>()

  private readonly categoryService = inject(CategoryService)
  private readonly formBuilder = inject(FormBuilder)

  readonly categoryForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.category()?.id,
    categoryName: [this.category()?.categoryName, Validators.required],
    description: this.category()?.description,
    categoryType: [this.category()?.categoryType, Validators.required]
  }))

  readonly categoryType = CategoryType
  readonly processingStatus$ = this.categoryService.processingStatus$()
  readonly failureMessages$ = this.categoryService.failureMessages$()

  ngOnInit() {
    this.categoryService.resetProcessingStatus()
  }

  resetForm() {
    this.categoryForm().reset(this.category())
  }

  upsertCategory() {
    const updatedCategory: Category = {...this.categoryForm().getRawValue()}
    if (isNil(updatedCategory.id)) {
      this.categoryService.post(updatedCategory)
    } else {
      this.categoryService.put(updatedCategory)
    }
  }

  deleteCategory() {
    this.categoryService.delete(this.category()?.id)
  }
}

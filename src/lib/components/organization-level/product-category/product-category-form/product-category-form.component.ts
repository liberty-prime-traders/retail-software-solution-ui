import {NgClass} from '@angular/common'
import {Component, computed, inject, input, output} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {ProductCategory} from '../../../../api/organization-level/product-category/product-category.model'
import {ProductCategoryService} from '../../../../api/organization-level/product-category/product-category.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'


@Component({
  selector: 'rts-product-category-form',
  templateUrl: 'product-category-form.component.html',
  imports: [
    FormButtonsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    FormFieldComponent,
    NgClass
  ]
})
export class ProductCategoryFormComponent extends BaseFormComponent<ProductCategoryService> {
  readonly productCategory = input<ProductCategory>()

  private readonly productCategoryService = inject(ProductCategoryService)
  private readonly formBuilder = inject(FormBuilder)
  protected readonly apiService = this.productCategoryService

  readonly productCategoryCreated = output<void>()

  readonly productCategoryForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.productCategory()?.id,
    categoryName: [this.productCategory()?.categoryName, Validators.required],
    description: this.productCategory()?.description
  }))

  resetForm() {
    this.productCategoryForm().reset(this.productCategory())
  }

  upsertProductCategory() {
    const updatedProductCategory: Partial<ProductCategory> = {...this.productCategoryForm().getRawValue()}
    if (isNil(updatedProductCategory.id)) {
      this.productCategoryService.post(updatedProductCategory)
    } else {
      this.productCategoryService.put(updatedProductCategory, {onSuccess: () => this.productCategoryCreated.emit()})
    }
  }

  deleteProductCategory() {
    this.productCategoryService.delete(this.productCategory()?.id)
  }
}

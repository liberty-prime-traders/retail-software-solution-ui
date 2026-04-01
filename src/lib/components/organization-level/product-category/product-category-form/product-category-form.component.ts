import {NgClass} from '@angular/common'
import {Component, effect, inject, input, output, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {ProductCategory} from '../../../../api/organization-level/product-category/product-category.model'
import {ProductCategoryService} from '../../../../api/organization-level/product-category/product-category.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ProductCategoryFormDefinition} from './product-category-form.definition'


@Component({
  selector: 'rts-product-category-form',
  templateUrl: 'product-category-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField,
    NgClass
  ]
})
export class ProductCategoryFormComponent extends BaseFormComponent<ProductCategoryService> {
  readonly productCategory = input<ProductCategory>()

  private readonly productCategoryService = inject(ProductCategoryService)
  protected readonly apiService = this.productCategoryService

  readonly productCategoryCreated = output<void>()

  readonly productCategoryFormModel = signal<ProductCategoryFormDefinition.ProductCategoryFormModel>(
    ProductCategoryFormDefinition.defaultProductCategoryFormModel
  )
  readonly productCategoryForm = form(
    this.productCategoryFormModel,
    ProductCategoryFormDefinition.productCategoryFormSchema
  )
  readonly productCategoryFieldMap = ProductCategoryFormDefinition.fieldMap

  constructor() {
    super()
    effect(() => {
      const current = this.productCategory()
      untracked(() => {
        this.productCategoryFormModel.set(
          ProductCategoryFormDefinition.convertToFormModel(current)
        )
      })
    })
    this.productCategoryService.resetProcessingStatus()
  }

  resetForm() {
    this.productCategoryFormModel.set(
      ProductCategoryFormDefinition.convertToFormModel(this.productCategory())
    )
  }

  upsertProductCategory() {
    const updatedProductCategory = ProductCategoryFormDefinition.convertToBackendModel(
      this.productCategoryFormModel()
    )
    if (!updatedProductCategory.id) {
      this.productCategoryService.post(updatedProductCategory)
    } else {
      this.productCategoryService.put(updatedProductCategory, {onSuccess: () => this.productCategoryCreated.emit()})
    }
  }

  deleteProductCategory() {
    this.productCategoryService.delete(this.productCategory()?.id)
  }
}

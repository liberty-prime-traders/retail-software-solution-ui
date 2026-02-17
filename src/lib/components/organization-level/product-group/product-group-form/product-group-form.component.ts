import {NgClass} from '@angular/common'
import {Component, inject, Input, OnInit, signal} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {ProductCategoryService} from '../../../../api/organization-level/product-category/product-category.service'
import {ProductGroup} from '../../../../api/organization-level/product-group/product-group.model'
import {ProductGroupService} from '../../../../api/organization-level/product-group/product-group.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ProductGroupFormDefinition} from './product-group-form.definition'


@Component({
  selector: 'rts-product-group-form',
  templateUrl: 'product-group-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    Select,
    FormField,
    NgClass
  ]
})
export class ProductGroupFormComponent extends BaseFormComponent<ProductGroupService> implements OnInit {

  private readonly productGroupService = inject(ProductGroupService)
  private readonly productCategoryService = inject(ProductCategoryService)
  protected override apiService: ProductGroupService = this.productGroupService

  @Input()
  set productGroup(productGroup: ProductGroup|null) {
    if (productGroup) {
      this.originalProductGroup.set(productGroup)
      this.productGroupFormValue.set(ProductGroupFormDefinition.convertToFormModel(productGroup))
    }
  }

  readonly originalProductGroup = signal<ProductGroup|undefined>(undefined)
  readonly productCategories = this.productCategoryService.selectAll

  readonly productGroupFormValue = signal<ProductGroupFormDefinition.ProductGroupFormModel>(
    ProductGroupFormDefinition.defaultProductGroupFormModel
  )

  readonly productGroupForm = form(this.productGroupFormValue, ProductGroupFormDefinition.productGroupFormSchema)
  readonly productGroupFormFields = ProductGroupFormDefinition.fieldMap

  override ngOnInit() {
    super.ngOnInit()
    this.productCategoryService.fetch()
  }

  resetForm() {
    this.productGroupFormValue.set(ProductGroupFormDefinition.convertToFormModel(this.originalProductGroup()))
  }

  upsertProductGroup() {
    const updatedProductGroup: Partial<ProductGroup> = ProductGroupFormDefinition.convertToBackendModel(this.productGroupFormValue())
    if (updatedProductGroup.id) {
      this.productGroupService.put(updatedProductGroup)
    } else {
      this.productGroupService.post(updatedProductGroup)
    }
    this.savedAtLeastOnce.set(true)
  }

  deleteProductGroup() {
    if (this.productGroupFormValue()?.id) {
      this.productGroupService.delete(this.productGroupFormValue()?.id)
    }
  }
}

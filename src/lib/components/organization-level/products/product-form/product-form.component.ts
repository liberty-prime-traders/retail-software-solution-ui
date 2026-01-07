import {Component, inject, input, OnInit, Signal, signal} from '@angular/core'
import {Field, form} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {CategoryService} from '../../../../api/organization-level/category/category.service'
import {Product} from '../../../../api/organization-level/product/product.model'
import {ProductService} from '../../../../api/organization-level/product/product.service'
import {UnitValue} from '../../../../api/organization-level/unit-value/unitvalue.model'
import {UnitValueService} from '../../../../api/organization-level/unit-value/unitvalue.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ProductFormDefinition} from './product-form.definition'

@Component({
  selector: 'rts-product-form',
  templateUrl: 'product-form.component.html',
  standalone: true,
  imports: [
    InputText,
    FormButtonsComponent,
    FormFieldComponent,
    Select,
    Field
  ]
})
export class ProductFormComponent extends BaseFormComponent<ProductService> implements OnInit {
  readonly product = input<Product>()

  private readonly productService = inject(ProductService)
  private readonly categoryService = inject(CategoryService)
  private readonly unitValueService = inject(UnitValueService)
  protected override apiService: ProductService =  this.productService

  readonly productCategories = this.categoryService.productCategories
  readonly unitValues: Signal<UnitValue[]> = this.unitValueService.selectAll

  private readonly productFormValue = signal<ProductFormDefinition.ProductFormModel>(
    ProductFormDefinition.defaultProductFormModel
  )

  readonly productFormFields = ProductFormDefinition.fieldMap

  readonly productForm = form(this.productFormValue, ProductFormDefinition.productFormSchema)


  override ngOnInit() {
    super.ngOnInit()
    this.categoryService.fetch()
    this.unitValueService.fetch()
  }

  resetForm() {
    this.productFormValue.set(ProductFormDefinition.convertToFormModel(this.product()))
  }

  upsertProduct() {
    const updatedProduct: Partial<Product> = ProductFormDefinition.convertToBackendModel(this.productFormValue())
    if (updatedProduct.id) {
      this.productService.put(updatedProduct)
    } else {
      this.productService.post(updatedProduct)
    }
    this.savedAtLeastOnce.set(true)
  }

  deleteProduct() {
    if (this.product()?.id) {
      this.productService.delete(this.product()?.id)
    }
  }
}

import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {CategoryType} from '../../../../api/organization-level/category/category-type.enum'
import {CategoryService} from '../../../../api/organization-level/category/category.service'
import {Product} from '../../../../api/organization-level/product/product.model'
import {ProductService} from '../../../../api/organization-level/product/product.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-product-form',
  templateUrl: 'product-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputText,
    FormButtonsComponent,
    FormFieldComponent,
    Select
  ]
})
export class ProductFormComponent implements OnInit {
  readonly product = input<Product>()
  private readonly productService = inject(ProductService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly categoryService = inject(CategoryService)

  readonly productCategories = computed(() =>
    this.categoryService.selectAll().filter(category => category.categoryType === CategoryType.PRODUCT)
  )

  readonly productForm = computed(() =>
    this.formBuilder.nonNullable.group({
      id: this.product()?.id,
      productName: [this.product()?.productName ?? '', Validators.required],
      description: [this.product()?.description ?? ''],
      categoryId: [this.product()?.categoryId ?? '', Validators.required]
    })
  )

  readonly processingStatus = this.productService.selectProcessingStatus
  readonly failureMessages = this.productService.selectFailureMessages

  ngOnInit() {
    this.productService.resetProcessingStatus()
    this.categoryService.fetch()
  }

  resetForm() {
    this.productForm().reset({
      ...this.product(),
      categoryId: this.product()?.categoryId ?? ''
    })
  }

  upsertProduct() {
    const updatedProduct: Partial<Product> = {...this.productForm().getRawValue()}
    if (isNil(updatedProduct.id)) {
      this.productService.post(updatedProduct)
    } else {
      this.productService.put(updatedProduct)
    }
  }

  deleteProduct() {
    if (this.product()?.id) {
      this.productService.delete(this.product()?.id)
    }
  }
}

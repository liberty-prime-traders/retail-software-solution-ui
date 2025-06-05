import {Component, OnInit, computed, inject, input} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {Product} from '../../../../api/product/product.model'
import {ProductService} from '../../../../api/product/product.service'
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
    FormFieldComponent
  ]
})
export class ProductFormComponent implements OnInit {
  readonly product = input<Product>()

  private readonly productService = inject(ProductService)
  private readonly formBuilder = inject(FormBuilder)

  readonly productForm = computed(() =>
    this.formBuilder.nonNullable.group({
      id: this.product()?.id,
      productName: [this.product()?.productName ?? '', Validators.required],
      description: [this.product()?.description ?? ''],
      categoryName: [this.product()?.categoryName ?? '', Validators.required]
    })
  )

  readonly processingStatus = this.productService.selectProcessingStatus
  readonly failureMessages = this.productService.selectFailureMessages

  ngOnInit() {
    this.productService.resetProcessingStatus()
  }

  resetForm() {
    this.productForm().reset(this.product())
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

import {Component, input, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Chip} from 'primeng/chip'
import {Product} from '../../../../api/product/product.model'
import {ProductFormComponent} from '../product-form/product-form.component'

@Component({
  selector: 'rts-product-details',
  templateUrl: 'product-details.component.html',
  imports: [
    ProductFormComponent,
    Chip,
    Button,
    FormsModule
  ]
})
export class ProductDetailsComponent {
  readonly selectedProduct = input<Product>()
  readonly showEditForm = signal(false)
}

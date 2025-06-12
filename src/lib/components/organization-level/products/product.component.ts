import {Component, computed, inject, model, OnInit, signal} from '@angular/core'
import {BlockUIModule} from 'primeng/blockui'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {Product} from '../../../api/product/product.model'
import {ProductService} from '../../../api/product/product.service'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {ProductDetailsComponent} from './product-details/product-details.component'
import {FormsModule} from '@angular/forms'
import {NgClass} from '@angular/common'
import {Button} from 'primeng/button'

@Component({
  selector: 'rts-product',
  templateUrl: 'product.component.html',
  standalone: true,
  imports: [
    TableModule,
    Divider,
    AddRowComponent,
    BlockUIModule,
    ProductDetailsComponent,
    FormsModule,
    NgClass,
    Button
  ]
})
export class ProductComponent implements OnInit {
  private readonly productService = inject(ProductService)

  readonly loading = this.productService.selectLoading
  readonly products = this.productService.selectAll

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly searchTerm = signal('')
  readonly selectedProduct = model<Product|undefined>(undefined)

  ngOnInit() {
    this.productService.fetch()
  }

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    return this.products().filter(p =>
      p.productName?.toLowerCase().includes(term) ||
      p.categoryName?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    )
  })

  selectProduct(product: Product) {
    this.selectedProduct.set(product)
  }

  clearSelection() {
    this.selectedProduct.set(undefined)
  }
}

import {Component, computed, inject, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {TableModule} from 'primeng/table'
import {Product} from '../../../../api/organization-level/product/product.model'
import {ProductService} from '../../../../api/organization-level/product/product.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {BaseGridComponent} from '../../../reusable/base-grid.component'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-product-details',
  templateUrl: 'product-details.component.html',
  imports: [
    FormsModule,
    TableModule,
    GridFilterComponent,
    NullSafePipe
  ]
})
export class ProductDetailsComponent extends BaseGridComponent<ProductService> {
  private readonly productService = inject(ProductService)
  protected readonly apiService: ProductService = this.productService

  readonly products = this.productService.selectAll
  readonly searchTerm = signal('')

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    return this.products().filter((p: Product) =>
      p.productName?.toLowerCase().includes(term) ||
      p.categoryName?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    )
  })

}

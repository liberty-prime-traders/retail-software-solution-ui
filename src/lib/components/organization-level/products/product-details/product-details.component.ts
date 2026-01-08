import {NgClass} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {ProductStatus} from '../../../../api/organization-level/product/product-status.enum'
import {Product} from '../../../../api/organization-level/product/product.model'
import {ProductService} from '../../../../api/organization-level/product/product.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ExpandableGridComponent} from '../../../reusable/expandable-grid.component'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'
import {ProductFormComponent} from '../product-form/product-form.component'

@Component({
  selector: 'rts-product-details',
  templateUrl: 'product-details.component.html',
  imports: [
    FormsModule,
    TableModule,
    GridFilterComponent,
    NullSafePipe,
    Button,
    ProductFormComponent,
    NgClass
  ]
})
export class ProductDetailsComponent extends ExpandableGridComponent<ProductService> {
  private readonly productService = inject(ProductService)
  protected readonly apiService: ProductService = this.productService

  readonly ProductStatus = ProductStatus

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

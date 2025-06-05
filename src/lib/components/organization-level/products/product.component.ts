import {ProductService} from '../../../api/product/product.service'
import {Component, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {ProductFormComponent} from './product-form/product-form.component'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {Product} from '../../../api/product/product.model'
import {BlockUIModule} from 'primeng/blockui'

@Component({
  selector: 'rts-product',
  templateUrl: 'product.component.html',
  standalone: true,
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    ProductFormComponent,
    Divider,
    GridFilterComponent,
    AddRowComponent,
    BlockUIModule
  ]
})
export class ProductComponent extends HasGridComponent<ProductService> {
  private readonly productService = inject(ProductService)

  readonly loading = this.productService.selectLoading
  readonly processingIsUnderWay = this.productService.processingIsUnderWay
  readonly products = this.productService.selectAll
  readonly apiService = this.productService

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  selectedProduct: Product | null = null

  clearSelection() {
    this.selectedProduct = null
    this.addingIsActive.set(false)
  }
}

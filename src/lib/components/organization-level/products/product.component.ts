import {Component, inject, model, OnInit, signal} from '@angular/core'
import {BlockUIModule} from 'primeng/blockui'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {Product} from '../../../api/product/product.model'
import {ProductService} from '../../../api/product/product.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {ProductDetailsComponent} from './product-details/product-details.component'

@Component({
  selector: 'rts-product',
  templateUrl: 'product.component.html',
  standalone: true,
  imports: [
    TableModule,
    NullSafePipe,
    Divider,
    GridFilterComponent,
    AddRowComponent,
    BlockUIModule,
    ProductDetailsComponent
  ]
})
export class ProductComponent implements OnInit {
  private readonly productService = inject(ProductService)

  readonly loading = this.productService.selectLoading
  readonly products = this.productService.selectAll

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly selectedProduct = model<Product|undefined>(undefined)

  ngOnInit() {
    this.productService.fetch()
  }
}

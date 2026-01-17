import {NgClass} from '@angular/common'
import {Component, inject, model} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {ProductStatus} from '../../../../api/organization-level/product/product-status.enum'
import {ProductService} from '../../../../api/organization-level/product/product.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ExpandableGridComponent} from '../../../reusable/expandable-grid.component'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'
import {ProductDataService} from '../product-data.servive'
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
    NgClass,
    Tag
  ]
})
export class ProductDetailsComponent extends ExpandableGridComponent<ProductService> {
  readonly productDataService = inject(ProductDataService)
  private readonly productService = inject(ProductService)
  protected readonly apiService: ProductService = this.productService

  readonly ProductStatus = ProductStatus

  readonly products = this.productService.selectAll
  readonly freeFormSearch = model<string>()

  showAdvancedFilter() {
    this.productDataService.toggleAdvancedFilter(true)
  }

}

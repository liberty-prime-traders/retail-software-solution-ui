import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, input, signal, viewChild} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {BaseProduct} from '../../../../api/cross-tier/product/base-product.model'
import {ProductSearchParameters} from '../../../../api/cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../../../api/cross-tier/product/product-status.enum'
import {SchemaLevel} from '../../../../api/platform-level/table-registry/schema-level.enum'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {
  LocationProductFormComponent
} from '../../../location-level/location-products/location-product-form/location-product-form.component'
import {
  OrganizationProductFormComponent
} from '../../../organization-level/products/product-form/organization-product-form.component'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {ProductFilterService} from '../product-filter.service'

@Component({
  selector: 'rts-product-grid',
  templateUrl: 'product-grid.component.html',
  imports: [
    FormsModule,
    TableModule,
    NullSafePipe,
    Button,
    NgClass,
    Tag,
    NgTemplateOutlet,
    OrganizationProductFormComponent,
    LocationProductFormComponent,
    Skeleton,
    AutoStretchDirective
  ]
})
export class ProductGridComponent<PRODUCT extends BaseProduct> {
  readonly productSearchService = inject(PaginatedBaseService<PRODUCT, ProductSearchParameters>)
  readonly productFilterService = inject(ProductFilterService<PRODUCT>)

  readonly ProductStatus = ProductStatus

  protected readonly table = viewChild.required(Table)
  readonly schemaLevel = input.required<SchemaLevel>()

  readonly rowIsExpanded = signal<boolean>(false)
  readonly products = this.productFilterService.filteredProducts
  protected readonly loading = this.productSearchService.selectLoading

  readonly isOrganizationLevel = computed(() => this.schemaLevel() === SchemaLevel.ORGANIZATION)
  readonly isLocationLevel = computed(() => this.schemaLevel() === SchemaLevel.LOCATION)

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    const loadedRowCount = this.productSearchService.getPaginatedCount()
    const overlapThreshold = 5
    if (Math.abs(loadedRowCount - (lazyLoadEvent.last ?? 0)) <= overlapThreshold) {
      this.productSearchService.loadNext()
    }
  }

  onRowExpand(): void {
    this.rowIsExpanded.set(true)
  }

  onRowCollapse(): void {
    this.rowIsExpanded.set(false)
  }
}

import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, effect, inject, input, signal, viewChild} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Table, TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {BaseProduct} from '../../../../api/cross-tier/product/base-product.model'
import {ProductSearchParameters} from '../../../../api/cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../../../api/cross-tier/product/product-status.enum'
import {SchemaLevel} from '../../../../api/platform-level/table-registry/schema-level.enum'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {
  LocationProductFormComponent
} from '../../../location-level/location-products/location-product-form/location-product-form.component'
import {OrganizationProductFormComponent} from '../../../organization-level/products/product-form/organization-product-form.component'
import {AutoStretchComponent} from '../../../reusable/auto-stretch.component'
import {AutoResizeConfig} from '../../../welcome/auto-resize-config'
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
    LocationProductFormComponent
  ]
})
export class ProductGridComponent<PRODUCT extends BaseProduct> extends AutoStretchComponent {
  protected readonly productSearchService = inject(PaginatedBaseService<PRODUCT, ProductSearchParameters>)
  readonly productFilterService = inject(ProductFilterService<PRODUCT>)

  readonly productLinesElementId = AutoResizeConfig.productLinesId
  readonly ProductStatus = ProductStatus

  protected readonly table = viewChild.required(Table)
  readonly schemaLevel = input.required<SchemaLevel>()

  readonly rowIsExpanded = signal<boolean>(false)
  private readonly lastIndexBeforeReload = signal(0)
  private readonly waitingForScrollRestore = signal(false)
  readonly products = this.productFilterService.filteredProducts

  protected readonly loading = computed(() =>
    this.productSearchService.selectLoading() || this.waitingForScrollRestore()
  )

  readonly isOrganizationLevel = computed(() => this.schemaLevel() === SchemaLevel.ORGANIZATION)
  readonly isLocationLevel = computed(() => this.schemaLevel() === SchemaLevel.LOCATION)

  private readonly resetScrollOnReload = effect(() => {
    if (this.productSearchService.selectProcessingStatus() === ProcessingStatus.SUCCESS && this.lastIndexBeforeReload() !== 0) {
      this.waitingForScrollRestore.set(true)
      setTimeout(() => {
        this.table().scrollToVirtualIndex(this.lastIndexBeforeReload())
        this.waitingForScrollRestore.set(false)
      }, 500)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    const loadedRowCount = this.productSearchService.selectCount()
    const overlapThreshold = 5
    if (Math.abs(loadedRowCount - (lazyLoadEvent.last ?? 0)) <= overlapThreshold) {
      this.productSearchService.loadNext()
      this.lastIndexBeforeReload.set(lazyLoadEvent.first ?? 0)
    }
  }

  onRowExpand(): void {
    this.rowIsExpanded.set(true)
  }

  onRowCollapse(): void {
    this.rowIsExpanded.set(false)
  }
}

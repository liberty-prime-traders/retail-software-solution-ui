import {Component, computed, effect, inject, output, viewChild} from '@angular/core'
import {MessageService} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {LocationProduct} from '../../../../api/location-level/location-product/location-product.model'
import {ProductSearchParameters} from '../../../../api/cross-tier/product/product-search-parameters.model'
import {UnitConversionGraphService} from '../../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {loadNextOnLazyLoad} from '../../../../api/util/paginated-api/paginated-lazy-load.util'
import {resetVirtualScrollOnSearch} from '../../../../utils/primeng-table.util'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ProductFilterService} from '../../../cross-tier/product/product-filter.service'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {OpeningStockCellComponent} from './opening-stock-cell.component'
import {OpeningStockDeclarationService} from './opening-stock-declaration.service'

@Component({
  selector: 'rts-opening-stock-grid',
  templateUrl: 'opening-stock-grid.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Skeleton,
    ButtonDirective,
    EmptyRowComponent,
    AutoStretchDirective,
    LoadingContainerComponent,
    OpeningStockCellComponent
  ]
})
export class OpeningStockGridComponent {
  private readonly productSearchService = inject(PaginatedBaseService<LocationProduct, ProductSearchParameters>)
  private readonly declarationService = inject(OpeningStockDeclarationService)
  private readonly messageService = inject(MessageService)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)
  readonly productFilterService = inject(ProductFilterService<LocationProduct>)

  readonly products = this.productFilterService.filteredProducts
  readonly canDeclare = this.declarationService.canDeclare
  readonly exitEditMode = output<void>()
  protected readonly unitsReady = computed(() => !this.unitConversionGraphService.isLoading())
  private readonly table = viewChild(Table)

  protected readonly loading = computed(() =>
    this.productSearchService.selectLoading()
    || this.declarationService.saving()
    || this.unitConversionGraphService.isLoading()
  )

  readonly $resetScrollOnSearch = effect(() => {
    this.productFilterService.searchTriggered()
    this.productSearchService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.productSearchService, lazyLoadEvent.last)
  }

  declareAll() {
    this.declarationService.declareAll(this.messageService)
  }
}

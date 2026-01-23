import {NgClass} from '@angular/common'
import {Component, computed, effect, inject, signal, viewChild} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Table, TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {ProductSearchService} from '../../../../api/organization-level/product-search/product-search.service'
import {ProductStatus} from '../../../../api/organization-level/product/product-status.enum'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {ProductFilterService} from '../product-filter/product-filter.service'
import {ProductFormComponent} from '../product-form/product-form.component'

@Component({
  selector: 'rts-product-details',
  templateUrl: 'product-details.component.html',
  imports: [
    FormsModule,
    TableModule,
    NullSafePipe,
    Button,
    ProductFormComponent,
    NgClass,
    Tag
  ]
})
export class ProductDetailsComponent {
  private readonly productSearchService = inject(ProductSearchService)
  readonly productFilterService = inject(ProductFilterService)

  private readonly table = viewChild(Table)

  readonly ProductStatus = ProductStatus
  readonly rowIsExpanded = signal<boolean>(false)
  private readonly lastIndexBeforeReload = signal(0)
  private readonly waitingForScrollRestore = signal(false)

  readonly products = this.productFilterService.filteredProducts
  readonly loading = computed(() =>
    this.productSearchService.selectLoading() || this.waitingForScrollRestore()
  )

  private readonly resetScrollOnReload = effect(() => {
    if (this.productSearchService.selectProcessingStatus() === ProcessingStatus.SUCCESS && this.lastIndexBeforeReload() !== 0) {
      this.waitingForScrollRestore.set(true)
      setTimeout(() => {
        this.table()?.scrollToVirtualIndex(this.lastIndexBeforeReload())
        this.waitingForScrollRestore.set(false)
      }, 500)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent) {
    const loadedRowCount = this.productSearchService.selectCount()
    const overlapThreshold = 5
    if (Math.abs(loadedRowCount - (lazyLoadEvent.last ?? 0)) <= overlapThreshold) {
      this.productSearchService.loadNext()
      this.lastIndexBeforeReload.set(lazyLoadEvent.first ?? 0)
    }
  }

}

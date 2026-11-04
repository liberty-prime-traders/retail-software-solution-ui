import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common'
import {Component, effect, inject, input, untracked} from '@angular/core'
import {Skeleton} from 'primeng/skeleton'
import {Table} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {
  ProductSalesLinesParameters
} from '../../../../../api/location-level/product-sales-report/product-sales-lines-parameters.model'
import {ProductSalesLinesService} from '../../../../../api/location-level/product-sales-report/product-sales-lines.service'
import {ProductSalesSummary} from '../../../../../api/location-level/product-sales-report/product-sales-summary.model'
import {AdjustmentDirection} from '../../../../../api/location-level/sale_session/sale-session.model'
import {loadNextForKeyOnLazyLoad} from '../../../../../api/util/keyed-paginated-api/keyed-paginated-lazy-load.util'
import {AutoStretchDirective} from '../../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../../reusable/empty-row/empty-row.component'
import {PercentFigurePipe} from '../shared/percent-figure.pipe'

@Component({
  selector: 'rts-product-sales-lines-grid',
  templateUrl: 'product-sales-lines-grid.component.html',
  imports: [
    Table,
    Tag,
    Skeleton,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    PercentFigurePipe,
    EmptyRowComponent,
    AutoStretchDirective
  ]
})
export class ProductSalesLinesGridComponent {
  private readonly productSalesLinesService = inject(ProductSalesLinesService)

  readonly locationProductId = input.required<string>()
  readonly parameters = input.required<ProductSalesLinesParameters | null>()
  readonly summary = input.required<ProductSalesSummary | undefined>()

  readonly AdjustmentDirection = AdjustmentDirection

  readonly lines = this.productSalesLinesService.selectForKey(this.locationProductId)
  readonly loading = this.productSalesLinesService.selectLoadingForKey(this.locationProductId)

  readonly $loadOnParameterChange = effect(() => {
    const parameters = this.parameters()
    const locationProductId = this.locationProductId()
    if (parameters) {
      untracked(() => this.productSalesLinesService.ensureLoaded(locationProductId, parameters))
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextForKeyOnLazyLoad(this.productSalesLinesService, this.locationProductId(), lazyLoadEvent.last)
  }
}

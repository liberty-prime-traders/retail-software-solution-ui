import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, effect, inject, input, untracked} from '@angular/core'
import {Skeleton} from 'primeng/skeleton'
import {Table} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {
  ProductPurchasesDeliveryLinesParameters
} from '../../../../../api/location-level/product-purchases-report/product-purchases-delivery-lines-parameters.model'
import {
  ProductPurchasesDeliveryLinesService
} from '../../../../../api/location-level/product-purchases-report/product-purchases-delivery-lines.service'
import {
  PurchaseDeliveryLineStatus
} from '../../../../../api/location-level/product-purchases-report/purchase-delivery-line-status.enum'
import {loadNextForKeyOnLazyLoad} from '../../../../../api/util/keyed-paginated-api/keyed-paginated-lazy-load.util'
import {PrettifyEnumPipe} from '../../../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-product-purchases-delivery-lines-grid',
  templateUrl: 'product-delivery-lines-grid.component.html',
  imports: [
    Table,
    Tag,
    Skeleton,
    CurrencyPipe,
    DatePipe,
    PrettifyEnumPipe,
    EmptyRowComponent
  ]
})
export class ProductDeliveryLinesGridComponent {
  private readonly productPurchasesDeliveryLinesService = inject(ProductPurchasesDeliveryLinesService)

  readonly locationProductId = input.required<string>()
  readonly parameters = input.required<ProductPurchasesDeliveryLinesParameters | null>()

  readonly PurchaseDeliveryLineStatus = PurchaseDeliveryLineStatus

  readonly deliveryLines = this.productPurchasesDeliveryLinesService.selectForKey(this.locationProductId)
  readonly loading = this.productPurchasesDeliveryLinesService.selectLoadingForKey(this.locationProductId)

  readonly $loadOnParameterChange = effect(() => {
    const parameters = this.parameters()
    const locationProductId = this.locationProductId()
    if (parameters) {
      untracked(() => this.productPurchasesDeliveryLinesService.ensureLoaded(locationProductId, parameters))
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextForKeyOnLazyLoad(this.productPurchasesDeliveryLinesService, this.locationProductId(), lazyLoadEvent.last)
  }
}

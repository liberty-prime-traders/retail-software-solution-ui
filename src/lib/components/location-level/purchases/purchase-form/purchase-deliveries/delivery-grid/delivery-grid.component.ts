import {CurrencyPipe, DatePipe, NgClass} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {PurchaseDelivery} from '../../../../../../api/location-level/delivery/purchase-delivery.model'
import {PurchaseStatus} from '../../../../../../api/location-level/purchase/purchase-status.enum'
import {ProductLabelPipe} from '../../../../../../utils/pipes/product-label.pipe'
import {EmptyRowComponent} from '../../../../../reusable/empty-row/empty-row.component'
import {PurchaseFormContext} from '../../form-utils/purchase-form-context'
import {DeliveryFormComponent} from '../delivery-form/delivery-form.component'

@Component({
  selector: 'rts-purchase-deliveries',
  templateUrl: 'delivery-grid.component.html',
  imports: [
    TableModule,
    Button,
    CurrencyPipe,
    DatePipe,
    EmptyRowComponent,
    ProductLabelPipe,
    DeliveryFormComponent,
    NgClass
  ]
})
export class DeliveryGridComponent {

  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly deliveries = this.purchaseFormContext.deliveries
  readonly showNewDeliveryForm = signal(false)
  readonly expandedRowKeys = signal<Record<string, boolean>>({})

  readonly canAddDeliveries = computed(() =>
    this.purchaseFormContext.purchaseForm.generalFields().value().purchaseStatus !== PurchaseStatus.FULLY_DELIVERED
  )

  onRowExpand(event: {data: PurchaseDelivery}) {
    this.expandedRowKeys.update(keys => ({...keys, [event.data.id as string]: true}))
  }

  onRowCollapse(event: {data: PurchaseDelivery}) {
    this.expandedRowKeys.update(keys => {
      const {[event.data.id as string]: _, ...rest} = keys
      return rest
    })
  }
}

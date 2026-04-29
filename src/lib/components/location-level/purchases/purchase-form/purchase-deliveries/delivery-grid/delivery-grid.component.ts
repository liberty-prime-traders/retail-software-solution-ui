import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {PurchaseStatus} from '../../../../../../api/location-level/purchase/purchase-status.enum'
import {TimezoneAwareDatePipe} from '../../../../../../utils/pipes/timezone-aware-date.pipe'
import {EmptyRowComponent} from '../../../../../reusable/empty-row/empty-row.component'
import {PurchaseFormContext} from '../../form-utils/purchase-form-context'
import {DeliveryFormComponent} from '../delivery-form/delivery-form.component'
import {DeliverySubgridComponent} from '../delivery-subgrid/delivery-subgrid.component'

@Component({
  selector: 'rts-purchase-deliveries',
  templateUrl: 'delivery-grid.component.html',
  imports: [
    TableModule,
    Button,
    CurrencyPipe,
    EmptyRowComponent,
    DeliveryFormComponent,
    DeliverySubgridComponent,
    NgClass,
    TimezoneAwareDatePipe
  ]
})
export class DeliveryGridComponent {

  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly deliveries = this.purchaseFormContext.deliveries
  readonly showNewDeliveryForm = signal(false)

  readonly canAddDeliveries = computed(() =>
    this.purchaseFormContext.purchaseForm.generalFields().value().purchaseStatus !== PurchaseStatus.FULLY_DELIVERED
  )
}

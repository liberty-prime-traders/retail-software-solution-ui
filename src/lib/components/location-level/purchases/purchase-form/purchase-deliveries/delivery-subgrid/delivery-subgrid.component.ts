import {CurrencyPipe} from '@angular/common'
import {Component, input} from '@angular/core'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {TableModule} from 'primeng/table'
import {PurchaseDelivery} from '../../../../../../api/location-level/delivery/purchase-delivery.model'
import {
  FullUnitDescriptionPipe
} from '../../../../../../api/organization-level/unit-conversion/pipes/full-unit-description.pipe'
import {ProductLabelPipe} from '../../../../../../utils/pipes/product-label.pipe'
import {KafkaEventLogComponent} from '../../../../kafka-event-log/kafka-event-log.component'

@Component({
  selector: 'rts-delivery-subgrid',
  templateUrl: 'delivery-subgrid.component.html',
  imports: [
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    TableModule,
    CurrencyPipe,
    ProductLabelPipe,
    KafkaEventLogComponent,
    FullUnitDescriptionPipe
  ]
})
export class DeliverySubgridComponent {
  readonly delivery = input.required<PurchaseDelivery>()
}

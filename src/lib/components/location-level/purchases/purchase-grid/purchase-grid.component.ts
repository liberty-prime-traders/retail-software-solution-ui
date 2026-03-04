import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, inject, output} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Purchase} from '../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {PurchaseStatusSeverityPipe} from '../purchase-status-severity.pipe'

@Component({
  selector: 'rts-purchase-grid',
  templateUrl: 'purchase-grid.component.html',
  imports: [
    TableModule,
    Button,
    Tag,
    NullSafePipe,
    PrettifyEnumPipe,
    PurchaseStatusSeverityPipe,
    DatePipe,
    AutoStretchDirective,
    CurrencyPipe
  ]
})
export class PurchaseGridComponent {
  private readonly purchaseService = inject(PurchaseService)

  readonly editPurchase = output<Purchase>()

  readonly purchases = this.purchaseService.selectAll
  readonly loading = this.purchaseService.selectLoading
}

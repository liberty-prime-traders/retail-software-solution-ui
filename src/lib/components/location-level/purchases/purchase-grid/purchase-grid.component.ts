import {CurrencyPipe} from '@angular/common'
import {TimezoneAwareDatePipe} from '../../../../utils/pipes/timezone-aware-date.pipe'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Purchase} from '../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {PaymentStatusSeverityPipe} from '../payment-status-severity.pipe'
import {PurchaseFormContext} from '../purchase-form/form-utils/purchase-form-context'
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
    TimezoneAwareDatePipe,
    AutoStretchDirective,
    CurrencyPipe,
    PaymentStatusSeverityPipe
  ]
})
export class PurchaseGridComponent {
  private readonly purchaseService = inject(PurchaseService)
  protected readonly context = inject(PurchaseFormContext)

  readonly purchases = this.purchaseService.selectAll
  readonly loading = this.purchaseService.selectLoading

  onEditPurchase(purchase: Purchase) {
    this.context.initializeForm(purchase)
  }
}

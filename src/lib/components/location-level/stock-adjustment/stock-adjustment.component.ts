import {Component, inject, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {StockAdjustmentService} from '../../../api/location-level/stock-adjustment/stock-adjustment.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {ErrorSummaryComponent} from '../../reusable/error-summary/error-summary.component'
import {HidesSaleButtonComponent} from '../hides-sale-button.component'
import {StockAdjustmentFormComponent} from './stock-adjustment-form/stock-adjustment-form.component'
import {StockAdjustmentGridComponent} from './stock-adjustment-grid/stock-adjustment-grid.component'

@Component({
  selector: 'rts-location-stock-adjustment',
  templateUrl: 'stock-adjustment.component.html',
  imports: [
    ButtonDirective,
    Divider,
    AutoStretchDirective,
    ErrorSummaryComponent,
    StockAdjustmentFormComponent,
    StockAdjustmentGridComponent
  ]
})
export class StockAdjustmentComponent extends HidesSaleButtonComponent {
  private readonly stockAdjustmentService = inject(StockAdjustmentService)

  readonly formIsVisible = signal(false)
  readonly failureMessages = this.stockAdjustmentService.selectFailureMessages
}

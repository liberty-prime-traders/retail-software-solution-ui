import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {SaleSummary} from '../../../../api/location-level/sale-summary/sale-summary.model'
import {SaleSummaryService} from '../../../../api/location-level/sale-summary/sale-summary.service'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {GridWithAddButtonComponent} from '../../../reusable/grid-with-add-button.component'
import {PaymentStatusSeverityPipe} from '../../purchases/payment-status-severity.pipe'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormVisibilityContext} from '../sale-form-visibility.context'
import {SaleStatusSeverityPipe} from '../sale-status-severity.pipe'

@Component({
  selector: 'rts-sale-grid',
  templateUrl: 'sale-grid.component.html',
  imports: [
    TableModule,
    Button,
    Tag,
    NullSafePipe,
    PrettifyEnumPipe,
    SaleStatusSeverityPipe,
    PaymentStatusSeverityPipe,
    DatePipe,
    CurrencyPipe,
    AutoStretchDirective
  ]
})
export class SaleGridComponent extends GridWithAddButtonComponent<SaleSummaryService> {
  private readonly saleSummaryService = inject(SaleSummaryService)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)
  private readonly context = inject(SaleFormContext)

  protected override readonly apiService = this.saleSummaryService

  readonly sales = this.saleSummaryService.selectAll

  onEditSale(sale: SaleSummary) {
    this.saleSessionService.startNewSession({saleId: sale.id}, {
      onSuccess: (updatedSession) => {
        this.context.selectOpenSession(updatedSession)
        this.saleFormVisibilityContext.showForm()
      }
    })
  }
}

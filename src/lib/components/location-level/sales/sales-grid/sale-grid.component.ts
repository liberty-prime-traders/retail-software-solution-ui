import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, inject, OnInit} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {SaleSummary} from '../../../../api/location-level/sale-summary/sale-summary.model'
import {SaleSummaryService} from '../../../../api/location-level/sale-summary/sale-summary.service'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {PaymentStatusSeverityPipe} from '../../purchases/payment-status-severity.pipe'
import {SaleFormNavigator} from '../form-utils/sale-form-navigator'
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
export class SaleGridComponent implements OnInit {
  private readonly saleSummaryService = inject(SaleSummaryService)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly navigator = inject(SaleFormNavigator)

  readonly sales = this.saleSummaryService.selectAll

  readonly loading = computed(() =>
    this.saleSessionService.selectLoading() || this.saleSummaryService.selectLoading()
  )

  onEditSale(sale: SaleSummary) {
    this.navigator.openForEditSale(sale.id)
  }

  ngOnInit() {
    this.saleSummaryService.fetch()
  }
}

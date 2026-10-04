import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Panel} from 'primeng/panel'
import {Table} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {SaleSearchSummaryService} from '../../../api/location-level/sale-summary/sale-search-summary.service'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {SaleStatusSeverityPipe} from './sale-status-severity.pipe'

@Component({
  selector: 'rts-sales-summary',
  imports: [
    Table,
    Panel,
    CurrencyPipe,
    PrettifyEnumPipe,
    EmptyRowComponent,
    Tag,
    SaleStatusSeverityPipe
  ],
  templateUrl: 'sales-summary.component.html'
})
export class SalesSummaryComponent {
  private readonly saleSearchSummaryService = inject(SaleSearchSummaryService)

  readonly saleSearchSummary = this.saleSearchSummaryService.saleSearchSummary
  readonly saleCount = this.saleSearchSummaryService.saleCount

  readonly confirmedReceivableTotal = computed(() => this.saleSearchSummary()?.confirmedReceivableTotal ?? 0)
  readonly confirmedDiscountTotal = computed(() => this.saleSearchSummary()?.confirmedDiscountTotal ?? 0)
  readonly paidTotal = computed(() => this.saleSearchSummary()?.paidTotal ?? 0)
  readonly outstandingTotal = computed(() => this.saleSearchSummary()?.outstandingTotal ?? 0)
  readonly creditTotal = computed(() => this.saleSearchSummary()?.creditTotal ?? 0)

  readonly statuses = computed(() => this.saleSearchSummary()?.statuses ?? [])
}

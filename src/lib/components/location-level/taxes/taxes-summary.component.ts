import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Panel} from 'primeng/panel'
import {Table} from 'primeng/table'
import {
  TaxEntrySearchSummaryService
} from '../../../api/location-level/tax-entry/tax-entry-search-summary.service'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-taxes-summary',
  imports: [
    Table,
    Panel,
    CurrencyPipe,
    EmptyRowComponent
  ],
  templateUrl: 'taxes-summary.component.html'
})
export class TaxesSummaryComponent {
  private readonly taxEntrySearchSummaryService = inject(TaxEntrySearchSummaryService)

  readonly taxEntrySearchSummary = this.taxEntrySearchSummaryService.taxEntrySearchSummary
  readonly entryCount = this.taxEntrySearchSummaryService.entryCount

  readonly grossTax = computed(() => this.taxEntrySearchSummary()?.grossTax ?? 0)
  readonly reversalTax = computed(() => this.taxEntrySearchSummary()?.reversalTax ?? 0)
  readonly netTax = computed(() => this.taxEntrySearchSummary()?.netTax ?? 0)

  readonly groups = computed(() => this.taxEntrySearchSummary()?.groups ?? [])
}

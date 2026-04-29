import {DatePipe} from '@angular/common'
import {Component, effect, inject, input, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {TableModule} from 'primeng/table'
import {StockHistoryService} from '../../../api/location-level/stock-history/stock-history.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-stock-history',
  templateUrl: 'stock-history.component.html',
  imports: [
    AutoStretchDirective,
    TableModule,
    EmptyRowComponent,
    DatePipe,
    NullSafePipe,
    PrettifyEnumPipe
  ]
})
export class StockHistoryComponent {
  private readonly stockHistoryService = inject(StockHistoryService)

  readonly locationProductId = input.required<EntityId | undefined>()

  readonly stockHistory = this.stockHistoryService.selectForGroup(this.locationProductId)
  readonly loading = this.stockHistoryService.selectLoading

  private readonly refetchStockHistory = effect(() => {
    const locationProductId = this.locationProductId()
    untracked(() => this.stockHistoryService.refetch(locationProductId))
  })
}

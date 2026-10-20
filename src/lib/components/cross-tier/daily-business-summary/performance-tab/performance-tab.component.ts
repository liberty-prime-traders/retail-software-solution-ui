import {CurrencyPipe, DatePipe, NgClass} from '@angular/common'
import {Component, computed, input, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Message} from 'primeng/message'
import {ProgressBar} from 'primeng/progressbar'
import {Skeleton} from 'primeng/skeleton'
import {TableModule} from 'primeng/table'
import {
  DailyPerformanceDay,
  DailyPerformanceFigures
} from '../../../../api/cross-tier/daily-business-summary/daily-performance.model'
import {SummaryTileComponent, TileTone} from '../summary-tile/summary-tile.component'
import {TrendChartComponent} from '../trend-chart/trend-chart.component'
import {buildCollectedRows, buildProfitAndLossRows, hasActivity} from '../summary-view.util'

@Component({
  selector: 'rts-performance-tab',
  templateUrl: 'performance-tab.component.html',
  styleUrl: 'performance-tab.component.scss',
  imports: [
    CurrencyPipe, NgClass, ButtonDirective, Card, Message, ProgressBar, Skeleton, TableModule,
    DatePipe, SummaryTileComponent, TrendChartComponent
  ]
})
export class PerformanceTabComponent {
  readonly figures = input<DailyPerformanceFigures | undefined>()
  readonly days = input<DailyPerformanceDay[]>([])
  readonly focusedDate = input<string | null>(null)
  readonly loading = input(false)
  readonly failed = input(false)
  readonly partial = input(false)
  readonly asOf = input<string | undefined>()

  readonly dayFocused = output<string>()
  readonly retried = output<void>()

  readonly TileTone = TileTone

  readonly profitAndLossRows = computed(() => {
    const figures = this.figures()
    return figures ? buildProfitAndLossRows(figures) : []
  })
  readonly collectedRows = computed(() => {
    const figures = this.figures()
    return figures ? buildCollectedRows(figures) : []
  })
  readonly showCards = computed(() => {
    const figures = this.figures()
    return !!figures && hasActivity(figures)
  })
  readonly costOfGoodsSoldShare = computed(() => {
    const figures = this.figures()
    return figures && figures.netSales > 0 ? `${Math.round(figures.costOfGoodsSold / figures.netSales * 100)}% of net sales` : null
  })
  readonly grossMarginLabel = computed(() => this.marginLabel(this.figures()?.grossMarginPercent))
  readonly netMarginLabel = computed(() => this.marginLabel(this.figures()?.netMarginPercent))
  readonly netProfitTone = computed(() => {
    const netProfit = this.figures()?.netProfit ?? 0
    if (netProfit > 0) return TileTone.SUCCESS
    return netProfit < 0 ? TileTone.DANGER : TileTone.NEUTRAL
  })

  private marginLabel(marginPercent: number | null | undefined): string | null {
    return marginPercent === null || marginPercent === undefined ? null : `${marginPercent}% margin`
  }
}

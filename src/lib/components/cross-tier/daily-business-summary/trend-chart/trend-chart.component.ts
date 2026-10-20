import {Component, computed, inject, input, output} from '@angular/core'
import {ChartData, ChartTypeRegistry, TooltipItem} from 'chart.js'
import {UIChart} from 'primeng/chart'
import {ChartDataSelectEvent, ChartOptionsBase} from 'primeng/types/chart'
import {DailyPerformanceDay} from '../../../../api/cross-tier/daily-business-summary/daily-performance.model'
import {PeriodStatus} from '../../../../api/cross-tier/daily-business-summary/period-status.enum'
import {CurrencyCodeProviderService} from '../../../../utils/services/currency-code-provider.service'
import {abbreviateAmount} from '../abbreviate-amount.util'
import {readThemeColor, withOpacity} from '../chart-theme.util'
import {formatDayLabel, formatFullDay} from '../../../../utils/dates'
import {TODAY_SO_FAR} from '../summary-view.util'

const DIMMED_OPACITY = 0.3

@Component({
  selector: 'rts-trend-chart',
  templateUrl: 'trend-chart.component.html',
  styleUrl: 'trend-chart.component.scss',
  imports: [UIChart]
})
export class TrendChartComponent {
  private readonly currencyCode = inject(CurrencyCodeProviderService).currencyCode

  readonly days = input.required<DailyPerformanceDay[]>()
  readonly focusedDate = input<string | null>(null)
  readonly dayFocused = output<string>()

  readonly netSalesColor = readThemeColor('--p-primary-color')
  readonly netProfitColor = readThemeColor('--p-green-500')

  readonly data = computed<ChartData>(() => {
    const days = this.days()
    const focusedDate = this.focusedDate()
    const barColors = (color: string) =>
      days.map(day => !focusedDate || day.date === focusedDate ? color : withOpacity(color, DIMMED_OPACITY))
    return {
      labels: days.map(day => formatDayLabel(day.date)),
      datasets: [
        {
          label: 'Net sales',
          data: days.map(day => day.figures.netSales),
          backgroundColor: barColors(this.netSalesColor)
        },
        {
          label: 'Net profit',
          data: days.map(day => day.figures.netProfit),
          backgroundColor: barColors(this.netProfitColor)
        }
      ]
    }
  })

  readonly options = computed<ChartOptionsBase>(() => {
    const days = this.days()
    const textColor = readThemeColor('--p-text-muted-color')
    const gridColor = readThemeColor('--p-content-border-color')
    const currencyFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: this.currencyCode})
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
        tooltip: {
          callbacks: {
            title: (items: TooltipItem<keyof ChartTypeRegistry>[]) => {
              const day = days[items[0].dataIndex]
              return day.status === PeriodStatus.IN_PROGRESS ? TODAY_SO_FAR : formatFullDay(day.date)
            },
            label: (item: TooltipItem<keyof ChartTypeRegistry>) =>
              `${item.dataset.label}: ${currencyFormatter.format(item.parsed.y ?? 0)}`
          }
        }
      },
      scales: {
        x: {ticks: {color: textColor}, grid: {display: false}},
        y: {ticks: {color: textColor, callback: (value: number | string) => abbreviateAmount(Number(value))}, grid: {color: gridColor}}
      }
    }
  })

  onDataSelect(event: ChartDataSelectEvent) {
    const {index} = event.element as {index: number}
    this.dayFocused.emit(this.days()[index].date)
  }
}

import {Component, computed, inject, input, output} from '@angular/core'
import {ChartData, ChartTypeRegistry, TooltipItem} from 'chart.js'
import {UIChart} from 'primeng/chart'
import {ChartDataSelectEvent, ChartOptionsBase} from 'primeng/types/chart'
import {DailyBalancesDay} from '../../../../api/cross-tier/daily-business-summary/daily-balances.model'
import {PeriodStatus} from '../../../../api/cross-tier/daily-business-summary/period-status.enum'
import {formatDayLabel, formatFullDay} from '../../../../utils/dates'
import {CurrencyCodeProviderService} from '../../../../utils/services/currency-code-provider.service'
import {abbreviateAmount} from '../abbreviate-amount.util'
import {readThemeColor} from '../chart-theme.util'
import {TODAY_SO_FAR} from '../summary-view.util'

@Component({
  selector: 'rts-net-worth-chart',
  templateUrl: 'net-worth-chart.component.html',
  imports: [UIChart]
})
export class NetWorthChartComponent {
  private readonly currencyCode = inject(CurrencyCodeProviderService).currencyCode
  private readonly lineColor = readThemeColor('--p-primary-color')
  private readonly hollowPointColor = readThemeColor('--p-content-background')

  readonly days = input.required<DailyBalancesDay[]>()
  readonly focusedDate = input<string | null>(null)
  readonly dayFocused = output<string>()

  readonly data = computed<ChartData>(() => {
    const days = this.days()
    const focusedDate = this.focusedDate()
    const pointFor = <VALUE>(focused: VALUE, hollow: VALUE) => days.map(day => day.date === focusedDate ? focused : hollow)
    return {
      labels: days.map(day => formatDayLabel(day.date)),
      datasets: [{
        label: 'Net worth',
        data: days.map(day => day.balances.netWorth),
        borderColor: this.lineColor,
        backgroundColor: this.lineColor,
        pointBackgroundColor: pointFor(this.lineColor, this.hollowPointColor),
        pointBorderColor: this.lineColor,
        pointRadius: pointFor(6, 4),
        pointHoverRadius: 7,
        tension: 0.2
      }]
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
            label: (item: TooltipItem<keyof ChartTypeRegistry>) => currencyFormatter.format(item.parsed.y ?? 0)
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

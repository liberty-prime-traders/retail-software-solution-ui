import {Component, computed, inject, input, output} from '@angular/core'
import {AgCharts} from 'ag-charts-angular'
import {AgChartOptions} from 'ag-charts-community'
import {DailyPerformanceDay} from '../../../../api/cross-tier/daily-business-summary/daily-performance.model'
import {PeriodStatus} from '../../../../api/cross-tier/daily-business-summary/period-status.enum'
import {CurrencyCodeProviderService} from '../../../../utils/services/currency-code-provider.service'
import {abbreviateAmount} from '../abbreviate-amount.util'
import {readThemeColor} from '../chart-theme.util'
import {formatDayLabel, formatFullDay} from '../../../../utils/dates'
import {TODAY_SO_FAR} from '../summary-view.util'

const DIMMED_OPACITY = 0.3

interface TrendDatum {
  date: string
  label: string
  title: string
  netSales: number
  netProfit: number
}

@Component({
  selector: 'rts-trend-chart',
  templateUrl: 'trend-chart.component.html',
  styleUrl: 'trend-chart.component.scss',
  imports: [AgCharts]
})
export class TrendChartComponent {
  private readonly currencyCode = inject(CurrencyCodeProviderService).currencyCode

  readonly days = input.required<DailyPerformanceDay[]>()
  readonly focusedDate = input<string | null>(null)
  readonly dayFocused = output<string>()

  readonly netSalesColor = readThemeColor('--p-primary-color')
  readonly netProfitColor = readThemeColor('--p-green-500')

  readonly options = computed<AgChartOptions>(() => {
    const focusedDate = this.focusedDate()
    const textColor = readThemeColor('--p-text-muted-color')
    const gridColor = readThemeColor('--p-content-border-color')
    const currencyFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: this.currencyCode})
    const data: TrendDatum[] = this.days().map(day => ({
      date: day.date,
      label: formatDayLabel(day.date),
      title: day.status === PeriodStatus.IN_PROGRESS ? TODAY_SO_FAR : formatFullDay(day.date),
      netSales: day.figures.netSales,
      netProfit: day.figures.netProfit
    }))
    const barSeries = (yKey: 'netSales' | 'netProfit', yName: string, fill: string) => ({
      type: 'bar' as const,
      xKey: 'label',
      yKey,
      yName,
      fill,
      strokeWidth: 0,
      itemStyler: ({datum}: {datum: TrendDatum}) => ({
        fillOpacity: !focusedDate || datum.date === focusedDate ? 1 : DIMMED_OPACITY
      }),
      tooltip: {
        renderer: ({datum}: {datum: TrendDatum}) => ({
          title: datum.title,
          data: [{label: yName, value: currencyFormatter.format(datum[yKey])}]
        })
      },
      listeners: {
        seriesNodeClick: ({datum}: {datum: TrendDatum}) => this.dayFocused.emit(datum.date)
      }
    })
    return {
      data,
      background: {visible: false},
      series: [
        barSeries('netSales', 'Net sales', this.netSalesColor),
        barSeries('netProfit', 'Net profit', this.netProfitColor)
      ],
      axes: {
        x: {type: 'category', position: 'bottom', line: {enabled: false}, label: {color: textColor}},
        y: {
          type: 'number',
          position: 'left',
          label: {color: textColor, formatter: ({value}) => abbreviateAmount(Number(value))},
          line: {enabled: false},
          gridLine: {style: [{stroke: gridColor, lineDash: [4, 4]}]}
        }
      }
    }
  })
}

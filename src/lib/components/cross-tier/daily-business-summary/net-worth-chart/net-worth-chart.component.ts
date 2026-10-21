import {Component, computed, inject, input, output} from '@angular/core'
import {AgCharts} from 'ag-charts-angular'
import {AgChartOptions} from 'ag-charts-community'
import {DailyBalancesDay} from '../../../../api/cross-tier/daily-business-summary/daily-balances.model'
import {PeriodStatus} from '../../../../api/cross-tier/daily-business-summary/period-status.enum'
import {formatDayLabel, formatFullDay} from '../../../../utils/dates'
import {CurrencyCodeProviderService} from '../../../../utils/services/currency-code-provider.service'
import {abbreviateAmount} from '../abbreviate-amount.util'
import {readThemeColor, withOpacity} from '../chart-theme.util'
import {TODAY_SO_FAR} from '../summary-view.util'

interface NetWorthDatum {
  date: string
  label: string
  title: string
  netWorth: number
}

@Component({
  selector: 'rts-net-worth-chart',
  templateUrl: 'net-worth-chart.component.html',
  styleUrl: 'net-worth-chart.component.scss',
  imports: [AgCharts]
})
export class NetWorthChartComponent {
  private readonly currencyCode = inject(CurrencyCodeProviderService).currencyCode
  private readonly lineColor = readThemeColor('--p-primary-color')
  private readonly hollowPointColor = readThemeColor('--p-content-background')

  readonly days = input.required<DailyBalancesDay[]>()
  readonly focusedDate = input<string | null>(null)
  readonly dayFocused = output<string>()

  readonly options = computed<AgChartOptions>(() => {
    const focusedDate = this.focusedDate()
    const textColor = readThemeColor('--p-text-muted-color')
    const gridColor = withOpacity(readThemeColor('--p-content-border-color'), 0.8)
    const currencyFormatter = new Intl.NumberFormat(undefined, {style: 'currency', currency: this.currencyCode})
    const data: NetWorthDatum[] = this.days().map(day => ({
      date: day.date,
      label: formatDayLabel(day.date),
      title: day.status === PeriodStatus.IN_PROGRESS ? TODAY_SO_FAR : formatFullDay(day.date),
      netWorth: day.balances.netWorth
    }))
    return {
      data,
      background: {visible: false},
      series: [{
        type: 'line',
        xKey: 'label',
        yKey: 'netWorth',
        yName: 'Net worth',
        stroke: this.lineColor,
        strokeWidth: 2.5,
        interpolation: {type: 'smooth'},
        marker: {
          shape: 'circle',
          stroke: this.lineColor,
          strokeWidth: 2,
          fill: this.hollowPointColor,
          size: 7,
          itemStyler: ({datum}: {datum: NetWorthDatum}) => datum.date === focusedDate
            ? {fill: this.lineColor, size: 11}
            : {}
        },
        tooltip: {
          renderer: ({datum}: {datum: NetWorthDatum}) => ({
            title: datum.title,
            data: [{label: 'Net worth', value: currencyFormatter.format(datum.netWorth)}]
          })
        },
        listeners: {
          seriesNodeClick: ({datum}: {datum: NetWorthDatum}) => this.dayFocused.emit(datum.date)
        }
      }],
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

import {CurrencyPipe} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {ProductSalesSummary} from '../../../../api/location-level/product-sales-report/product-sales-summary.model'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {PercentFigurePipe} from './percent-figure.pipe'

@Component({
  selector: 'rts-gross-sales-split',
  templateUrl: 'gross-sales-split.component.html',
  styleUrl: 'gross-sales-split.component.scss',
  imports: [CurrencyPipe, NullishToZeroPipe, PercentFigurePipe]
})
export class GrossSalesSplitComponent {
  readonly summary = input.required<ProductSalesSummary>()
  readonly showLegend = input(true)

  // A loss gives the profit segment no width, and a net surcharge gives the adjustments segment none.
  readonly segments = computed(() => {
    const summary = this.summary()
    const amounts = [
      {label: 'COGS', amount: summary.cogs, cssClass: 'split-cogs'},
      {label: 'Gross profit', amount: summary.grossProfit, cssClass: 'split-profit'},
      {label: 'Adjustments', amount: summary.grossSales - summary.netSales, cssClass: 'split-adjustments'}
    ]
    return amounts.map(segment => ({
      ...segment,
      weight: Math.max(segment.amount, 0),
      percent: summary.grossSales ? segment.amount / summary.grossSales * 100 : null
    }))
  })

  readonly ariaLabel = computed(() =>
    `Of ${this.summary().grossSales} gross sales: `
    + this.segments().map(segment => `${segment.label} ${segment.percent?.toFixed(1) ?? 0} percent`).join(', ')
  )
}

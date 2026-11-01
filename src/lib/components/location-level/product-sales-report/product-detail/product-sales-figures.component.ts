import {CurrencyPipe} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {ProductSalesSummary} from '../../../../api/location-level/product-sales-report/product-sales-summary.model'
import {GrossSalesSplitComponent} from '../shared/gross-sales-split.component'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PercentFigurePipe} from '../shared/percent-figure.pipe'

enum FigureFormat {
  MONEY = 'MONEY',
  PERCENT = 'PERCENT'
}

enum FigureRule {
  NONE = '',
  NET = 'rule-net',
  COGS = 'rule-cogs',
  PROFIT = 'rule-profit'
}

interface Figure {
  label: string
  hint?: string
  total: number | null
  perUnit: number | null
  format: FigureFormat
  emphasis: boolean
  indented: boolean
  profit: boolean
  rule: FigureRule
}

@Component({
  selector: 'rts-product-sales-figures',
  templateUrl: 'product-sales-figures.component.html',
  styleUrl: 'product-sales-figures.component.scss',
  imports: [CurrencyPipe, NullSafePipe, PercentFigurePipe, GrossSalesSplitComponent]
})
export class ProductSalesFiguresComponent {
  readonly summary = input.required<ProductSalesSummary>()

  readonly FigureFormat = FigureFormat

  readonly figures = computed((): Figure[] => {
    const summary = this.summary()
    const unit = summary.baseUnitName
    const perUnit = (total: number) => summary.baseQuantity ? total / summary.baseQuantity : null
    const money = (figure: Partial<Figure> & Pick<Figure, 'label' | 'total' | 'perUnit'>): Figure => ({
      format: FigureFormat.MONEY, emphasis: false, indented: false, profit: false, rule: FigureRule.NONE, ...figure
    })
    return [
      money({
        label: 'Gross sales', hint: `Per ${unit} is the average list price`,
        total: summary.grossSales, perUnit: summary.avgListPrice
      }),
      money({
        label: 'Discounts', total: summary.discountTotal, perUnit: perUnit(summary.discountTotal), indented: true
      }),
      money({
        label: 'Surcharges', total: summary.surchargeTotal, perUnit: perUnit(summary.surchargeTotal), indented: true
      }),
      money({
        label: 'Net sales', hint: `Per ${unit} is the average selling price`, total: summary.netSales,
        perUnit: summary.avgSellingPrice, emphasis: true, rule: FigureRule.NET
      }),
      money({
        label: 'COGS', hint: `Per ${unit} is the average cost`, total: summary.cogs,
        perUnit: summary.avgCost, emphasis: true, rule: FigureRule.COGS
      }),
      money({
        label: 'Gross profit', hint: `Per ${unit} is the profit per ${unit}`, total: summary.grossProfit,
        perUnit: summary.profitPerBaseUnit, emphasis: true, profit: true, rule: FigureRule.PROFIT
      }),
      {
        label: 'Margin', total: summary.marginPercent, perUnit: null, format: FigureFormat.PERCENT,
        emphasis: false, indented: false, profit: false, rule: FigureRule.NONE
      },
      {
        label: 'Margin before adjustments', total: summary.marginBeforeAdjustmentsPercent, perUnit: null,
        format: FigureFormat.PERCENT, emphasis: false, indented: true, profit: false, rule: FigureRule.NONE
      }
    ]
  })
}

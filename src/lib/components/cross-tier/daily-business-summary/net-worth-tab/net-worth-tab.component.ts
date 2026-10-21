import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, input, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Message} from 'primeng/message'
import {Skeleton} from 'primeng/skeleton'
import {TableModule} from 'primeng/table'
import {BalanceSections, DailyBalancesDay} from '../../../../api/cross-tier/daily-business-summary/daily-balances.model'
import {BalanceEffect} from '../../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {AmountChangeComponent} from '../amount-change/amount-change.component'
import {NetWorthChartComponent} from '../net-worth-chart/net-worth-chart.component'
import {SummaryTileComponent} from '../summary-tile/summary-tile.component'
import {BalanceRowKind, buildBalanceRows, buildNetWorthTiles} from '../summary-view.util'

@Component({
  selector: 'rts-net-worth-tab',
  templateUrl: 'net-worth-tab.component.html',
  styleUrl: 'net-worth-tab.component.scss',
  imports: [
    CurrencyPipe, NgClass, ButtonDirective, Card, Message, Skeleton, TableModule,
    AmountChangeComponent, NetWorthChartComponent, SummaryTileComponent
  ]
})
export class NetWorthTabComponent {
  readonly balances = input<BalanceSections | undefined>()
  readonly days = input<DailyBalancesDay[]>([])
  readonly focusedDate = input<string | null>(null)
  readonly loading = input(false)
  readonly failed = input(false)
  readonly cardTitle = input('')
  readonly changeLabel = input('Change')
  readonly changeSuffix = input('')

  readonly dayFocused = output<string>()
  readonly retried = output<void>()

  readonly BalanceRowKind = BalanceRowKind
  readonly BalanceEffect = BalanceEffect

  readonly tiles = computed(() => {
    const balances = this.balances()
    return balances ? buildNetWorthTiles(balances) : []
  })
  readonly featuredTile = computed(() => this.tiles().find(tile => tile.emphasized))

  readonly otherTiles = computed(() => this.tiles().filter(tile => !tile.emphasized))

  readonly rows = computed(() => {
    const balances = this.balances()
    return balances ? buildBalanceRows(balances) : []
  })
}

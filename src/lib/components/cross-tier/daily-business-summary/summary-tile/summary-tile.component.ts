import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {Card} from 'primeng/card'
import {BalanceEffect} from '../../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {Skeleton} from 'primeng/skeleton'
import {AmountChangeComponent} from '../amount-change/amount-change.component'

export enum TileTone {
  NEUTRAL = 'NEUTRAL',
  SUCCESS = 'SUCCESS',
  DANGER = 'DANGER'
}

@Component({
  selector: 'rts-summary-tile',
  templateUrl: 'summary-tile.component.html',
  styleUrl: 'summary-tile.component.scss',
  imports: [Card, Skeleton, CurrencyPipe, NgClass, AmountChangeComponent]
})
export class SummaryTileComponent {
  readonly label = input.required<string>()
  readonly amount = input<number>(0)
  readonly subLabel = input<string | null>(null)
  readonly caption = input<string>('')
  readonly change = input<number | null>(null)
  readonly changeSuffix = input<string>('')
  readonly changeEffect = input(BalanceEffect.ZERO)
  readonly emphasized = input(false)
  readonly tone = input(TileTone.NEUTRAL)
  readonly loading = input(false)

  readonly amountClass = computed(() => [
    this.emphasized() ? 'text-3xl' : 'text-xl',
    this.tone() === TileTone.SUCCESS ? 'text-green-600' : '',
    this.tone() === TileTone.DANGER ? 'text-red-600' : ''
  ].filter(cssClass => cssClass))
  readonly toneIconClass = computed(() => {
    if (this.tone() === TileTone.SUCCESS) return 'pi pi-arrow-up'
    if (this.tone() === TileTone.DANGER) return 'pi pi-arrow-down'
    return ''
  })
}

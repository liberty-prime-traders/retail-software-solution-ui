import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {BalanceEffect, findColorClass} from '../../api/organization-level/chart-of-accounts/balance-effect.enum'

@Component({
  selector: 'rts-money',
  imports: [
    NgClass,
    CurrencyPipe
  ],
  template: `
    <div class="money" [ngClass]="colorClass()">
      {{ absoluteAmount() | currency }}
    </div>
  `
})
export class MoneyComponent {
  readonly amount = input<number|undefined>(0)
  readonly balanceEffect = input<BalanceEffect|undefined>(BalanceEffect.ZERO)

  readonly absoluteAmount = computed(() => Math.abs(this.amount() ?? 0))

  readonly colorClass = computed(() => findColorClass(this.balanceEffect()))

}

import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {BalanceSignal, findColorClass} from '../../api/organization-level/chart-of-accounts/balance-signal.enum'

@Component({
  selector: 'rts-money',
  imports: [
    NgClass,
    CurrencyPipe
  ],
  template: `
    <div class="monospace" [ngClass]="colorClass()">
      {{ absoluteAmount() | currency }}
    </div>
  `
})
export class MoneyComponent {
  readonly amount = input<number|undefined>(0)
  readonly balanceSignal = input(BalanceSignal.ZERO_BALANCE)

  readonly absoluteAmount = computed(() => Math.abs(this.amount() ?? 0))

  readonly colorClass = computed(() => findColorClass(this.balanceSignal()))

}

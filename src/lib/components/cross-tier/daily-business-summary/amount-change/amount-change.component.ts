import {Component, computed, input} from '@angular/core'
import {BalanceSignal} from '../../../../api/organization-level/chart-of-accounts/balance-signal.enum'
import {MoneyComponent} from '../../../reusable/money.component'

@Component({
  selector: 'rts-amount-change',
  templateUrl: 'amount-change.component.html',
  imports: [MoneyComponent]
})
export class AmountChangeComponent {
  readonly amount = input.required<number>()
  readonly suffix = input<string>('')
  /** Assets are money in and liabilities money out; a zero change is neutral for both. */
  readonly nonZeroSignal = input(BalanceSignal.MONEY_IN)

  readonly iconClass = computed(() => {
    if (this.amount() > 0) return 'pi pi-arrow-up'
    if (this.amount() < 0) return 'pi pi-arrow-down'
    return 'pi pi-minus'
  })
  readonly sign = computed(() => this.amount() > 0 ? '+' : this.amount() < 0 ? '-' : '')
  readonly balanceSignal = computed(() => this.amount() === 0 ? BalanceSignal.ZERO_BALANCE : this.nonZeroSignal())
}

import {Component, computed, input} from '@angular/core'
import {BalanceEffect} from '../../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {MoneyComponent} from '../../../reusable/money.component'

@Component({
  selector: 'rts-amount-change',
  templateUrl: 'amount-change.component.html',
  imports: [MoneyComponent]
})
export class AmountChangeComponent {
  readonly amount = input.required<number>()
  readonly suffix = input<string>('')
  readonly changeEffect = input.required<BalanceEffect>()

  readonly iconClass = computed(() => {
    if (this.amount() > 0) return 'pi pi-arrow-up'
    if (this.amount() < 0) return 'pi pi-arrow-down'
    return 'pi pi-minus'
  })
  readonly sign = computed(() => this.amount() > 0 ? '+' : this.amount() < 0 ? '-' : '')
}

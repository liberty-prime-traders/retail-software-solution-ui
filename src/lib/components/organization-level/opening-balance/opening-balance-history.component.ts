import {DatePipe} from '@angular/common'
import {Component, effect, inject, input, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {TableModule} from 'primeng/table'
import {
  OpeningBalanceRevisionService
} from '../../../api/organization-level/opening-balance/opening-balance-revision.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {MoneyComponent} from '../../reusable/money.component'

@Component({
  selector: 'rts-opening-balance-history',
  templateUrl: 'opening-balance-history.component.html',
  imports: [
    TableModule,
    EmptyRowComponent,
    DatePipe,
    MoneyComponent,
    AutoStretchDirective
  ]
})
export class OpeningBalanceHistoryComponent {
  private readonly openingBalanceRevisionService = inject(OpeningBalanceRevisionService)

  readonly accountCode = input.required<EntityId | undefined>()

  readonly openingBalanceRevisions = this.openingBalanceRevisionService.selectForGroup(this.accountCode)
  readonly loading = this.openingBalanceRevisionService.selectLoading

  private readonly refetchOpeningBalanceHistory = effect(() => {
    const accountCode = this.accountCode()
    untracked(() => this.openingBalanceRevisionService.getHistory(accountCode))
  })
}

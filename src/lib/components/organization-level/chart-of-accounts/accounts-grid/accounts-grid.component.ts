import {NgClass} from '@angular/common'
import {Component, computed, inject, model, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {TableModule} from 'primeng/table'
import {ToggleSwitch} from 'primeng/toggleswitch'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {AccountService} from '../../../../api/organization-level/chart-of-accounts/account.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../../reusable/grid-with-add-button.component'
import {MoneyComponent} from '../../../reusable/money.component'
import {OpeningBalanceHistoryComponent} from '../../opening-balance/opening-balance-history.component'
import {AccountFormComponent} from '../account-form/account-form.component'
import {AccountPopUpReason} from '../account-pop-up-reason.enum'
import {OpeningBalanceEditComponent} from '../opening-balance-edit/opening-balance-edit.component'

@Component({
  selector: 'rts-accounts-grid',
  imports: [
    AccountFormComponent,
    AutoStretchDirective,
    Button,
    EmptyRowComponent,
    GridFilterComponent,
    MoneyComponent,
    NullSafePipe,
    PrettifyEnumPipe,
    PrimeTemplate,
    TableModule,
    ToggleSwitch,
    Dialog,
    OpeningBalanceHistoryComponent,
    NgClass,
    FormsModule,
    OpeningBalanceEditComponent
  ],
  templateUrl: 'accounts-grid.component.html'
})
export class AccountsGridComponent extends GridWithAddButtonComponent<AccountService> {
  private readonly accountService = inject(AccountService)
  readonly apiService = this.accountService

  readonly AccountPopUpReason = AccountPopUpReason

  readonly showEditButtons = model(false)
  readonly accounts = this.accountService.selectAll
  readonly poppedUpAccount = signal<Account|null>(null)
  readonly showPopup = model(false)

  readonly popupReason = computed(() =>
    this.showEditButtons() ? AccountPopUpReason.UPDATE_OPENING_BALANCE : AccountPopUpReason.SHOW_OPENING_BALANCE_HISTORY
  )

  readonly popUpHeader = computed(() => {
    if (!this.popupReason() || !this.poppedUpAccount()) return ''
    const accountDescription = `${this.poppedUpAccount()!.name} (${this.poppedUpAccount()!.code})`
    switch (this.popupReason()!) {
      case AccountPopUpReason.SHOW_OPENING_BALANCE_HISTORY:
        return `Opening Balance Update History: ${accountDescription}`
      case AccountPopUpReason.UPDATE_OPENING_BALANCE:
        return `Update Opening Balance: ${accountDescription}`
      default:
        return ''
    }
  })

  togglePopup(account: Account) {
    this.poppedUpAccount.set(account)
    this.showPopup.set(true)
  }

}

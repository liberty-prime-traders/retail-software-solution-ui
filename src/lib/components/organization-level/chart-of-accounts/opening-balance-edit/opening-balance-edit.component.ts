import {CurrencyPipe} from '@angular/common'
import {Component, inject, input, model, OnInit} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {Message} from 'primeng/message'
import {Nullable} from 'primeng/ts-helpers'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {
  OpeningBalanceRevisionService
} from '../../../../api/organization-level/opening-balance/opening-balance-revision.service'
import {CurrencyCodeProviderService} from '../../../../utils/services/currency-code-provider.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'

@Component({
  selector: 'rts-opening-balance-edit',
  imports: [
    Message,
    FormFieldComponent,
    CurrencyPipe,
    InputNumber,
    Button,
    LoadingContainerComponent,
    ErrorSummaryComponent
  ],
  templateUrl: 'opening-balance-edit.component.html'
})
export class OpeningBalanceEditComponent implements OnInit{
  readonly currencyCodeProviderService = inject(CurrencyCodeProviderService)
  private readonly openingBalanceRevisionService = inject(OpeningBalanceRevisionService)
  private readonly messageService = inject(MessageService)

  readonly showDialog = model(false)
  readonly account = input.required<Account | null>()
  readonly loading = this.openingBalanceRevisionService.selectLoading
  readonly failureMessages = this.openingBalanceRevisionService.selectFailureMessages

  ngOnInit() {
    this.openingBalanceRevisionService.resetProcessingStatus()
  }

  updateOpeningBalance(newBalance: Nullable<number>) {
    if (!this.account || !this.account()?.code || newBalance === null || newBalance === undefined) {
      return
    }
    this.openingBalanceRevisionService.updateOpeningBalance(this.account()!.code, newBalance,
      {
        onSuccess: () => {
          this.messageService.add({
            severity:'success',
            summary: 'Success',
            detail: 'Opening balance updated successfully'
          })
          this.showDialog.set(false)
        }
      }
    )
  }
}

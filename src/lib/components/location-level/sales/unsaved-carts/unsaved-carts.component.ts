import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {
  UnsavedCartsSummaryService
} from '../../../../api/location-level/unsaved-carts-summary/unsaved-carts-summary.service'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {SaleFormNavigator} from '../form-utils/sale-form-navigator'

@Component({
  selector: 'rts-open-sale-sessions',
  templateUrl: 'unsaved-carts.component.html',
  imports: [
    TableModule,
    DatePipe,
    NullSafePipe,
    Button,
    CurrencyPipe,
    ErrorSummaryComponent
  ]
})
export class UnsavedCartsComponent {
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly unsavedCartsSummaryService = inject(UnsavedCartsSummaryService)
  private readonly navigator = inject(SaleFormNavigator)

  readonly failureMessages = this.unsavedCartsSummaryService.selectFailureMessages
  readonly myUnsavedCarts = this.unsavedCartsSummaryService.selectAll

  readonly gridLoading = computed(() =>
    this.unsavedCartsSummaryService.selectLoading() || this.saleSessionService.selectLoading()
  )

  resumeSession(sessionId: string) {
    this.navigator.resumeOpenSession(sessionId)
  }

  discardSession(sessionId: string) {
    this.navigator.discardSession(sessionId)
  }

  proceedToNewSession() {
    this.navigator.proceedToNewSession()
  }

  hideSaleForm() {
    this.navigator.closeForm()
  }
}

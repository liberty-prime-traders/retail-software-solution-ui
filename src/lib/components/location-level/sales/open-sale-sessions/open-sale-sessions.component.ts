import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {
  SaleSessionSummaryService
} from '../../../../api/location-level/sale-session-summary/sale-session-summary.service'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormVisibilityContext} from '../sale-form-visibility.context'

@Component({
  selector: 'rts-open-sale-sessions',
  templateUrl: 'open-sale-sessions.component.html',
  imports: [
    TableModule,
    DatePipe,
    NullSafePipe,
    Button,
    CurrencyPipe,
    ErrorSummaryComponent
  ]
})
export class OpenSaleSessionsComponent {
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly saleFormContext = inject(SaleFormContext)
  private readonly saleSessionSummaryService = inject(SaleSessionSummaryService)
  private readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)

  readonly failureMessages = this.saleSessionSummaryService.selectFailureMessages
  readonly myOpenSessions = this.saleSessionSummaryService.selectAll

  readonly gridLoading = computed(() =>
    this.saleSessionSummaryService.selectLoading() || this.saleSessionService.selectLoading()
  )

  resumeSession(sessionId: string) {
    this.saleSessionService.acquireSession(sessionId, {onSuccess: this.saleFormContext.selectOpenSession})
  }

  proceedToNewSession() {
    this.saleFormContext.hideOpenSessions()
  }

  hideSaleForm() {
    this.saleFormVisibilityContext.hideForm()
  }
}

import {Component, computed, inject, input, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {Message} from 'primeng/message'
import {FiscalPeriod} from '../../../../api/organization-level/fiscal-period/fiscal-period.model'
import {FiscalPeriodService} from '../../../../api/organization-level/fiscal-period/fiscal-period.service'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'

@Component({
  selector: 'rts-fiscal-period-close',
  imports: [
    Message,
    Button,
    ErrorSummaryComponent
  ],
  templateUrl: 'fiscal-period-close.component.html'
})
export class FiscalPeriodCloseComponent extends BaseFormComponent<FiscalPeriodService> {
  private readonly fiscalPeriodService = inject(FiscalPeriodService)
  protected override readonly apiService = this.fiscalPeriodService

  readonly fiscalPeriod = input.required<FiscalPeriod>()

  readonly closeInProgress = computed(() =>
    this.processingStatus() === ProcessingStatus.IN_PROGRESS
  )

  readonly pendingClose = signal(false)

  initiateClose() {
    this.pendingClose.set(true)
  }

  cancelClose() {
    this.pendingClose.set(false)
  }

  confirmClose() {
    this.pendingClose.set(false)
    const period = this.fiscalPeriod()
    if (period.yearEnd) {
      this.fiscalPeriodService.yearEndClose(period.id)
    } else {
      this.fiscalPeriodService.close([period.id])
    }
  }
}

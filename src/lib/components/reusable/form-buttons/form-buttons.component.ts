import {Component, computed, input, model, output, signal} from '@angular/core'
import {FieldState} from '@angular/forms/signals'
import {ConfirmationService} from 'primeng/api'
import {ButtonModule} from 'primeng/button'
import {ConfirmDialogModule} from 'primeng/confirmdialog'
import {ProgressSpinner} from 'primeng/progressspinner'
import {Tag} from 'primeng/tag'
import {FormAction} from '../../../utils/types/form-action.enum'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {ErrorSummaryComponent} from '../error-summary/error-summary.component'
import {TooltipComponent} from '../tooltip/tooltip.component'

@Component({
  selector: 'rts-forms-buttons',
  templateUrl: 'form-buttons.component.html',
  providers: [ConfirmationService],
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ProgressSpinner,
    Tag,
    TooltipComponent,
    ErrorSummaryComponent
  ]
})
export class FormButtonsComponent<T> {
  readonly save = output()
  readonly delete = output()
  readonly resetAction = output()

  readonly signalForm = input<FieldState<unknown>>()
  readonly fieldMap = input<Map<keyof T, string>>()

  readonly hideDelete = input(false)
  readonly hideReset = input(false)
  readonly hideSave = input(false)

  readonly disableDelete = input(false)
  readonly disableReset = input(false)
  readonly disableSave = input(false)

  readonly saveLabel = input('Save')
  readonly resetLabel = input('Reset')
  readonly deleteLabel = input('Delete')
  readonly deleteWarning = input('Are you sure you want to delete this record?')

  readonly processingStatus = model<ProcessingStatus|undefined|null>(ProcessingStatus.IDLE)
  readonly deleteInProgressMessage = input('Deleting...')
  readonly saveInProgressMessage = input('Saving...')
  readonly successMessage = input('Success')
  readonly failureMessages = input<string[] | undefined | null>()

  readonly ProcessingStatus = ProcessingStatus

  readonly processingIsUnderway = computed(() => this.processingStatus() === ProcessingStatus.IN_PROGRESS)
  readonly latestFormAction = signal<FormAction|undefined>(undefined)
  readonly deleteIsActive = signal(false)

  readonly inProgressMessage = computed(() =>
    this.latestFormAction() === FormAction.DELETE ? this.deleteInProgressMessage() : this.saveInProgressMessage()
  )

  confirmReset() {
    this.processingStatus.set(ProcessingStatus.IDLE)
    this.resetAction.emit()
  }

  confirmSave() {
    this.processingStatus.set(ProcessingStatus.IDLE)
    this.latestFormAction.set(FormAction.SAVE)
    this.save.emit()
  }

  confirmDelete() {
    this.processingStatus.set(ProcessingStatus.IDLE)
    this.latestFormAction.set(FormAction.DELETE)
    this.delete.emit()
    this.deleteIsActive.set(false)
  }
}

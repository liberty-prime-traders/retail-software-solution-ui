import {Component, inject, input, output, signal} from '@angular/core'
import {form, FormField, required, schema} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {ManualJournal} from '../../../../api/organization-level/manual-journal/manual-journal.model'
import {ManualJournalService} from '../../../../api/organization-level/manual-journal/manual-journal.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

interface ReversalFormModel {
  reason: string
}

@Component({
  selector: 'rts-journal-correction-reversal-form',
  templateUrl: 'journal-correction-reversal-form.component.html',
  imports: [FormButtonsComponent, FormFieldComponent, FormField, InputText]
})
export class JournalCorrectionReversalFormComponent extends BaseFormComponent<ManualJournalService> {
  readonly manualJournal = input.required<ManualJournal>()

  readonly reversed = output()
  readonly cancelled = output()

  protected readonly apiService = inject(ManualJournalService)

  readonly FormFieldDirection = FormFieldLayout

  private readonly reversalFormValue = signal<ReversalFormModel>({reason: ''})
  readonly reversalForm = form(this.reversalFormValue, schema<ReversalFormModel>((path) => {
    required(path.reason)
  }))

  confirmReversal() {
    this.apiService.reverseManualJournal(
      this.manualJournal().referenceNumber,
      this.reversalFormValue().reason,
      {onSuccess: () => this.reversed.emit()}
    )
  }
}

import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, input, output, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {ManualJournal} from '../../../../api/organization-level/manual-journal/manual-journal.model'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {
  JournalCorrectionReversalFormComponent
} from '../journal-correction-reversal-form/journal-correction-reversal-form.component'

@Component({
  selector: 'rts-journal-correction-expanded-row',
  templateUrl: 'journal-correction-expanded-row.component.html',
  imports: [
    ButtonDirective,
    CurrencyPipe,
    NgClass,
    NullSafePipe,
    PrettifyEnumPipe,
    TableModule,
    EmptyRowComponent,
    JournalCorrectionReversalFormComponent
  ]
})
export class JournalCorrectionExpandedRowComponent {
  readonly manualJournal = input.required<ManualJournal>()

  readonly changed = output()

  readonly reversingIsVisible = signal(false)

  readonly isReversible = computed(() =>
    !this.manualJournal().reversedByReferenceNumber && !this.manualJournal().reversalOfReferenceNumber
  )
}

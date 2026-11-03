import {NgClass} from '@angular/common'
import {Component, inject, OnInit, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {ManualJournalService} from '../../../api/organization-level/manual-journal/manual-journal.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {JournalCorrectionFormComponent} from './journal-correction-form/journal-correction-form.component'
import {JournalCorrectionExpandedRowComponent} from './journal-correction-expanded-row/journal-correction-expanded-row.component'

@Component({
  selector: 'rts-journal-corrections',
  templateUrl: 'journal-corrections.component.html',
  imports: [
    TableModule,
    ButtonDirective,
    Tag,
    AutoStretchDirective,
    EmptyRowComponent,
    JournalCorrectionFormComponent,
    JournalCorrectionExpandedRowComponent,
    NgClass
  ]
})
export class JournalCorrectionsComponent implements OnInit {
  private readonly manualJournalService = inject(ManualJournalService)

  readonly manualJournals = this.manualJournalService.selectAll
  readonly loading = this.manualJournalService.selectLoading

  readonly formIsVisible = signal(false)

  ngOnInit() {
    this.manualJournalService.fetch()
  }

  refreshAfterWrite() {
    this.formIsVisible.set(false)
    this.manualJournalService.refetch()
  }
}

import {Component, inject, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {TableModule, TableRowCollapseEvent, TableRowExpandEvent} from 'primeng/table'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Tag} from 'primeng/tag'
import {MessageService} from 'primeng/api'
import {DbMigrationHistoryService} from '../../../../api/db-migration/db-migration-history.service'
import {MigrationStatusSeverityPipe} from '../../../../utils/pipes/migration-status-severity.pipe'
import {MigrationTypeLabelPipe} from '../../../../utils/pipes/migration-type-label.pipe'
import {DatePipe} from '@angular/common'
import {MigrationHistory} from '../../../../api/db-migration/db-migration-history.model'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component';

@Component({
  selector: 'rts-migration-history',
  imports: [
    TableModule,
    Button,
    Tag,
    MigrationStatusSeverityPipe,
    MigrationTypeLabelPipe,
    DatePipe,
    FormsModule,
    DatePicker,
    EmptyRowComponent
  ],
  templateUrl: './migration-history.component.html'
})
export class MigrationHistoryComponent implements OnInit {
  private readonly dbMigrationHistoryService = inject(DbMigrationHistoryService)
  private readonly messageService = inject(MessageService)

  readonly dateRange = signal<Date[]>([])
  readonly expandedRows = signal<Record<string, boolean>>({})

  readonly migrations = this.dbMigrationHistoryService.selectAll
  readonly loading = this.dbMigrationHistoryService.selectLoading

  ngOnInit() {
    const end = new Date()
    const start = new Date()
    start.setMonth(end.getMonth() - 1)
    this.dateRange.set([start, end])
    this.loadHistory()
  }

  loadHistory() {
    const [start, end] = this.dateRange()
    if (start && end) {
      this.dbMigrationHistoryService.getHistory(start, end)
    }
  }

  handleDateRangeChange(newDates: Date[]) {
    console.log(newDates)
    this.dateRange.set(newDates)
    this.loadHistory()
  }

  expandAll() {
    const expanded: Record<string, boolean> = {}
    this.migrations().forEach(m => {
      expanded[m.id] = true
    })
    this.expandedRows.set(expanded)
  }

  collapseAll() {
    this.expandedRows.set({})
  }
}

import {Component, inject, OnInit, signal} from '@angular/core'
import {TableModule, TableRowCollapseEvent, TableRowExpandEvent} from 'primeng/table'
import {Button} from 'primeng/button'
import {Tag} from 'primeng/tag'
import {MessageService} from 'primeng/api'
import {DbMigrationHistoryService} from '../../../../api/db-migration/db-migration-history.service'
import {MigrationStatusSeverityPipe} from '../../../../utils/pipes/migration-status-severity.pipe'
import {MigrationTypeLabelPipe} from '../../../../utils/pipes/migration-type-label.pipe'
import {DatePipe} from '@angular/common'
import {MigrationHistory} from '../../../../api/db-migration/db-migration-history.model'
import {DatePicker} from 'primeng/datepicker'
import {Calendar} from 'primeng/calendar'
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'rts-migration-history',
  imports: [
    DatePicker,
    TableModule,
    Button,
    Tag,
    MigrationStatusSeverityPipe,
    MigrationTypeLabelPipe,
    DatePipe,
    FormsModule
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

  onRowExpand(event: TableRowExpandEvent) {
    const migration = event.data as MigrationHistory
    this.messageService.add({
      severity: 'info',
      summary: 'Migration Expanded',
      detail: `${migration.organizationName} - ${migration.versionNumber}`,
      life: 3000
    })
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const migration = event.data as MigrationHistory
    this.messageService.add({
      severity: 'success',
      summary: 'Migration Collapsed',
      detail: `${migration.organizationName} - ${migration.versionNumber}`,
      life: 3000
    })
  }
}

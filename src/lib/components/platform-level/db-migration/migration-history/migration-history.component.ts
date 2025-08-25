import {DatePipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Tooltip} from 'primeng/tooltip'
import {DbMigrationService} from '../../../../api/db-migration/db-migration.service'
import {MigrationStatusSeverityPipe} from '../../../../utils/pipes/migration-status-severity.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-migration-history',
  imports: [
    TableModule,
    Button,
    Tag,
    MigrationStatusSeverityPipe,
    DatePipe,
    FormsModule,
    DatePicker,
    EmptyRowComponent,
    PrettifyEnumPipe,
    Tooltip
  ],
  templateUrl: './migration-history.component.html'
})
export class MigrationHistoryComponent implements OnInit {
  private readonly dbMigrationService = inject(DbMigrationService)

  private readonly startDate = this.getStartDate()
  private readonly endDate = new Date()
  readonly dateRange = model([this.startDate, this.endDate])
  readonly expandedRows = signal<Record<string, boolean>>({})

  readonly migrations = this.dbMigrationService.selectAll
  readonly loading = this.dbMigrationService.selectLoading

  ngOnInit() {
    this.reloadMigrationHistory()
  }

  private getStartDate() {
    const today = new Date()
    today.setMonth(today.getMonth() - 1)
    return today
  }

  reloadMigrationHistory() {
    this.dbMigrationService.refetch(this.dateRange())
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

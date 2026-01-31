import {DatePipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Tooltip} from 'primeng/tooltip'
import {DbMigrationService} from '../../../../api/platform-level/db-migration/db-migration.service'
import {MigrationStatusSeverityPipe} from '../../../../utils/pipes/migration-status-severity.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchComponent} from '../../../reusable/auto-stretch.component'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {AutoResizeConfig} from '../../../welcome/auto-resize-config'

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
export class MigrationHistoryComponent extends AutoStretchComponent implements OnInit {
  private readonly dbMigrationService = inject(DbMigrationService)

  readonly dateRange = model([this.getStartDate(), new Date()])
  readonly expandedRows = signal<Record<string, boolean>>({})

  readonly migrations = this.dbMigrationService.selectAll
  readonly loading = this.dbMigrationService.selectLoading

  readonly dbMigrationElementId = AutoResizeConfig.dbMigrationsId

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

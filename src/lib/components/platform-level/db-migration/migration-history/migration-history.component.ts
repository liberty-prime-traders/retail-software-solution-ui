import {NgClass} from '@angular/common'
import {TimezoneAwareDatePipe} from '../../../../utils/pipes/timezone-aware-date.pipe'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Tooltip} from 'primeng/tooltip'
import {DbMigrationService} from '../../../../api/platform-level/db-migration/db-migration.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {LocationMigrationGridComponent} from './location-migration-grid/location-migration-grid.component'
import {MigrationStatusSeverityPipe} from './migration-status-severity.pipe'

@Component({
  selector: 'rts-migration-history',
  imports: [
    TableModule,
    Button,
    Tag,
    MigrationStatusSeverityPipe,
    TimezoneAwareDatePipe,
    FormsModule,
    DatePicker,
    EmptyRowComponent,
    PrettifyEnumPipe,
    Tooltip,
    NgClass,
    LocationMigrationGridComponent,
    AutoStretchDirective
  ],
  templateUrl: './migration-history.component.html'
})
export class MigrationHistoryComponent implements OnInit {
  private readonly dbMigrationService = inject(DbMigrationService)

  readonly dateRange = model([this.getStartDate(), new Date()])
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

import {DatePipe} from '@angular/common'
import {Component, input} from '@angular/core'
import {PrimeTemplate} from 'primeng/api'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {LocationMigration} from '../../../../../api/platform-level/db-migration/location-migration.model'
import {PrettifyEnumPipe} from '../../../../../utils/pipes/prettify-enum.pipe'
import {MigrationStatusSeverityPipe} from '../migration-status-severity.pipe'

@Component({
  selector: 'rts-location-migration-grid',
  templateUrl: 'location-migration-grid.component.html',
  imports: [
    DatePipe,
    MigrationStatusSeverityPipe,
    PrettifyEnumPipe,
    PrimeTemplate,
    TableModule,
    Tag
  ]
})
export class LocationMigrationGridComponent {
  readonly locations = input<LocationMigration[]>([])
}

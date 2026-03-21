import {DatePipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {SyncService} from '../../../api/location-level/sync/sync.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {SyncStatusSeverityPipe} from './sync-status-severity.pipe'

@Component({
  selector: 'rts-sync-grid',
  templateUrl: 'sync-grid.component.html',
  imports: [
    TableModule,
    Tag,
    DatePipe,
    NullSafePipe,
    PrettifyEnumPipe,
    SyncStatusSeverityPipe
  ]
})
export class SyncGridComponent {
  private readonly syncService = inject(SyncService)

  readonly syncs = this.syncService.selectAll
  readonly loading = this.syncService.selectLoading
}

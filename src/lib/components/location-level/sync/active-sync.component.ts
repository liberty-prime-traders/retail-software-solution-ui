import {DatePipe} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop'
import {Button} from 'primeng/button'
import {Message} from 'primeng/message'
import {ProgressBar} from 'primeng/progressbar'
import {Tag} from 'primeng/tag'
import {filter, interval} from 'rxjs'
import {switchMap, tap} from 'rxjs/operators'
import {SyncStatus} from '../../../api/location-level/sync/sync-status.enum'
import {SyncService} from '../../../api/location-level/sync/sync.service'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {SyncStatusSeverityPipe} from './sync-status-severity.pipe'

@Component({
  selector: 'rts-active-sync',
  templateUrl: 'active-sync.component.html',
  imports: [
    Button,
    Tag,
    ProgressBar,
    Message,
    DatePipe,
    PrettifyEnumPipe,
    SyncStatusSeverityPipe
  ]
})
export class ActiveSyncComponent extends HasSubscriptionComponent implements OnInit {
  private readonly syncService = inject(SyncService)

  readonly SyncStatus = SyncStatus
  readonly loading = this.syncService.selectLoading
  readonly activeSyncLog = this.syncService.selectActiveSyncLog
  readonly syncInProgress = this.syncService.selectSyncInProgress

  private readonly pollSyncProgress$ = toObservable(this.syncInProgress).pipe(
    switchMap((syncInProgress: boolean) => interval(3000).pipe(
      filter(() => syncInProgress),
      tap(() => this.syncService.pollSyncProgress(this.activeSyncLog()?.id!))
    )),
    takeUntilDestroyed(this.destroyRef)
  )

  ngOnInit() {
    this.pollSyncProgress$.subscribe()
  }

  cancelSync() {
    const syncLog = this.activeSyncLog()
    if (syncLog?.id) {
      this.syncService.cancelSync(syncLog.id)
    }
  }
}

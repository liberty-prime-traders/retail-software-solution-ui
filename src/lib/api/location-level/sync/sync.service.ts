import {HttpParams} from '@angular/common/http'
import {computed, Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {SyncStatus} from './sync-status.enum'
import {BaseService} from '../../util/base-api/base.service'
import {SyncLog, SyncMode, SyncRequest, TableName} from './sync.model'
import {SyncStore} from './sync.store'

@Injectable({providedIn: 'root'})
export class SyncService extends BaseService<SyncLog, SyncRequest> {

  constructor(protected override readonly store: SyncStore) {
    super(store)
  }

  readonly selectActiveSyncLog = computed(() =>
    this.selectAll().find(log => !this.isTerminalStatus(log.status))
  )

  readonly selectSyncInProgress = computed(() => this.selectActiveSyncLog() !== undefined)

  override getHttpParams(): HttpParams {
    return new HttpParams().set('top', 15)
  }

  initiateSync(tableName: TableName, syncMode: SyncMode) {
    this.patchApiRequestConfig({upsertOnSuccess: true})
    return this.post({tableName, syncMode})
  }

  pollSyncProgress(syncLogId: EntityId) {
    return this.refetchById(syncLogId)
  }

  private isTerminalStatus(status: SyncStatus): boolean {
    return [SyncStatus.COMPLETED, SyncStatus.FAILED, SyncStatus.CANCELED].includes(status)
  }

  cancelSync(syncLogId: EntityId) {
    const currentLog = this.store.selectForId(syncLogId)
    if (currentLog) {
      this.store.upsert({...currentLog, status: SyncStatus.CANCELLATION_REQUESTED})
    }
    this.patchApiRequestConfig({urlSuffix: 'cancel'})
    return this.post(undefined, syncLogId)
  }
}

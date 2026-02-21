import {Pipe, PipeTransform} from '@angular/core'
import {SyncStatus} from '../../../api/location-level/sync/sync-status.enum'
import {RtsSeverity} from '../../../utils/types/severity'

@Pipe({
  name: 'syncStatusSeverity',
  standalone: true
})
export class SyncStatusSeverityPipe implements PipeTransform {
  transform(status: SyncStatus): RtsSeverity {
    switch (status) {
      case SyncStatus.IN_PROGRESS: return RtsSeverity.INFO
      case SyncStatus.COMPLETED: return RtsSeverity.SUCCESS
      case SyncStatus.FAILED: return RtsSeverity.DANGER
      case SyncStatus.CANCELED: return RtsSeverity.SECONDARY
      case SyncStatus.CANCELLATION_REQUESTED: return RtsSeverity.WARN
      default: return RtsSeverity.INFO
    }
  }
}

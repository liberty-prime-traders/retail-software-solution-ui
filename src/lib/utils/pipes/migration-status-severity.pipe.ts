import {Pipe, PipeTransform} from '@angular/core'
import {MigrationStatus} from '../../api/platform-level/db-migration/migration-status.enum'

@Pipe({
  name: 'migrationStatusSeverity'
})
export class MigrationStatusSeverityPipe implements PipeTransform {
  transform(status?: MigrationStatus) {
    switch (status) {
    case MigrationStatus.SUCCESS:
      return 'success'
    case MigrationStatus.FAILURE:
      return 'danger'
    case MigrationStatus.PARTIAL:
      return 'warn'
    default:
      return 'info'
    }
  }
}

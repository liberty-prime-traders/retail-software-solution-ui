import {Pipe, PipeTransform} from '@angular/core'
import {MigrationStatus} from '../../../../api/platform-level/db-migration/migration-status.enum'
import {RtsSeverity} from '../../../../utils/types/severity'

@Pipe({
  name: 'migrationStatusSeverity'
})
export class MigrationStatusSeverityPipe implements PipeTransform {
  transform(status?: MigrationStatus): RtsSeverity {
    switch (status) {
    case MigrationStatus.SUCCESS:
      return RtsSeverity.SUCCESS
    case MigrationStatus.FAILURE:
      return RtsSeverity.DANGER
    case MigrationStatus.PARTIAL:
      return RtsSeverity.WARN
    default:
      return RtsSeverity.INFO
    }
  }
}

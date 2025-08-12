import {Pipe, PipeTransform} from '@angular/core'
import {MigrationType} from '../../api/db-migration/migration-type.enum'

@Pipe({
  name: 'migrationTypeLabel'
})
export class MigrationTypeLabelPipe implements PipeTransform {
  transform(type: MigrationType) {
    switch (type) {
    case MigrationType.ORG_WITH_LOCATIONS: return 'Organization'
    case MigrationType.LOCATIONS_ONLY: return 'Locations Only'
    default: return 'Unknown'
    }
  }
}

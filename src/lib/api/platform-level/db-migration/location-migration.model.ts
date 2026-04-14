import {BaseModel} from '../../util/base-api/base.model'
import {MigrationStatus} from './migration-status.enum'

export interface LocationMigration extends BaseModel {
  locationId?: string
  locationName?: string
  versionNumber?: string
  startOn?: string
  endOn?: string
  status?: MigrationStatus
  message?: string
}

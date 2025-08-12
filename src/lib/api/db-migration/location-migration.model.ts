import {BaseModel} from '../base-api/base.model'
import {MigrationStatus} from './migration-status.enum'

export interface LocationMigration extends BaseModel {
  locationId?: string;
  locationName?: string;
  versionNumber?: string;
  migrationParentId?: string;
  startDate?: string;
  endDate?: string;
  status?: MigrationStatus;
  message?: string;
}

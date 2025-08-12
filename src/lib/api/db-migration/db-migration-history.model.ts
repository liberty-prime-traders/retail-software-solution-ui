import {MigrationType} from './migration-type.enum'
import {MigrationStatus} from './migration-status.enum'
import {BaseModel} from '../base-api/base.model'
import {LocationMigration} from './location-migration.model'

export interface MigrationHistory extends BaseModel {
  organizationId?: string;
  organizationName?: string;
  versionNumber?: string;
  migrationParentId?: string;
  startDate?: string;
  endDate?: string;
  type?: MigrationType;
  status?: MigrationStatus;
  message?: string;
  locations: LocationMigration[];
}

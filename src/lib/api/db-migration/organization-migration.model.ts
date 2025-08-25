import {BaseModel} from '../base-api/base.model'
import {LocationMigration} from './location-migration.model'
import {MigrationStatus} from './migration-status.enum'

export interface OrganizationMigrationModel extends BaseModel {
  organizationName?: string;
  versionNumber?: string;
  startOn?: string;
  endOn?: string;
  status?: MigrationStatus;
  message?: string;
  locations: LocationMigration[];
}

import {BaseModel} from '../base-api/base.model'
import {MigrationType} from './migration-type.enum'
import {MigrationStatus} from './migration-status.enum'
import {SchemaOwnerType} from './schema-owner-type.enum'

export interface DbMigration extends BaseModel {
  dbVersionId?: string;
  schemaOwnerId?: string;
  schemaOwner?: string;
  schemaOwnerType?: SchemaOwnerType;
  type?: MigrationType;
  migrationParentId?: string;
  startOn?: string;
  endOn?: string;
  status: MigrationStatus;
  message?: string;
  locations?: DbMigration[];
}

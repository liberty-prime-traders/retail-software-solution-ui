export interface DbMigrationRequestDto {
  organizationId: string;
  locationIdsToMigrate: Array<string>;
  targetDbVersionId: string;
}

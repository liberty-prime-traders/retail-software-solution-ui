export interface DbMigrationRequestDto {
  schemaOwnerId: string;
  locationIdsToMigrate: Array<string>;
  targetDbVersionId: string;
}

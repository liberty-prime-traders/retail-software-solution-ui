export interface DbMigrationRequestDto {
  schemaOwnerId: string;
  locationIdsToMigrate: Set<string>;
  targetDbVersionId: string;
}

export interface DbMigrationRetryRequestDto {
  orgMigrationId: string;
  locationIdsToMigrate: Set<string>;
}

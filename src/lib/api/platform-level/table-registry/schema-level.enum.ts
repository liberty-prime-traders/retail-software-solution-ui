export enum SchemaLevel {
  PLATFORM = 'PLATFORM',
  ORGANIZATION = 'ORGANIZATION',
  LOCATION = 'LOCATION'
}

export const isOrganizationLevel = (level: SchemaLevel): boolean => {
  return level === SchemaLevel.ORGANIZATION
}

export const isLocationLevel = (level: SchemaLevel): boolean => {
  return level === SchemaLevel.LOCATION
}

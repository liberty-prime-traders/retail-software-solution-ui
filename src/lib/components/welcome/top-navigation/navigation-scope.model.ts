export enum NavigationScope {
  LANDING  = 'LANDING',
  PLATFORM = 'PLATFORM',
  ORG      = 'ORG',
  LOCATION = 'LOCATION',
}

export interface ScopePillConfig {
  scope: NavigationScope
  label: string
  icon: string
  routerLink: string
  activeBgColor: string
  placeholder?: string
}

export const PlatformPillConfig: ScopePillConfig = {
  scope: NavigationScope.PLATFORM,
  label: 'Platform',
  icon: 'pi pi-desktop',
  routerLink: '/secure/manage-platform',
  activeBgColor: '#EEEDFE'
}

export const OrganizationPillConfig: ScopePillConfig = {
  scope: NavigationScope.ORG,
  label: 'Organization',
  icon: 'pi pi-sitemap',
  placeholder: 'Select org',
  routerLink: '/secure/manage-organization',
  activeBgColor: '#E1F5EE'
}

export const LocationPillConfig: ScopePillConfig = {
  scope: NavigationScope.LOCATION,
  label: 'Location',
  icon: 'pi pi-map-marker',
  placeholder: 'Select a location',
  routerLink: '/secure/location-dashboard',
  activeBgColor: '#FCE8F0'
}

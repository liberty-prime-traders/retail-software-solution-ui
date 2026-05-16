import {inject, Injectable, signal} from '@angular/core'
import {Router} from '@angular/router'
import {OKTA_CALLBACK_ROUTE} from '../../../app/app.routes'
import {Location} from '../../api/organization-level/location/location.model'
import {Organization} from '../../api/platform-level/organization/organization.model'
import {NavigationScope} from '../../components/welcome/top-navigation/navigation-scope.model'
import {LocalStorageKey} from '../types/local-storage-key.enum'
import {LocalStorageService} from './local-storage.service'

@Injectable({providedIn: 'root'})
export class SessionContextService {
  private readonly localStorageService = inject(LocalStorageService)
  private readonly router = inject(Router)

  private readonly _selectedScope = signal<NavigationScope>(NavigationScope.LANDING)
  private readonly _selectedOrganization = signal<Organization | null>(null)
  private readonly _selectedLocation = signal<Location | null>(null)
  private readonly _knownOrganizations = signal<Organization[]>([])

  readonly selectedScope = this._selectedScope.asReadonly()
  readonly selectedOrganization = this._selectedOrganization.asReadonly()
  readonly selectedLocation = this._selectedLocation.asReadonly()
  readonly knownOrganizations = this._knownOrganizations.asReadonly()

  constructor() {
    this._selectedScope.set(this.deriveInitialScope())
    this.selectOrganization(this.loadSelectedOrganization(), false)
    this.selectLocation(this.loadSelectedLocation())
    this.navigateToInitialScope()
  }

  private deriveInitialScope(): NavigationScope {
    if (this._selectedLocation())     return NavigationScope.LOCATION
    if (this._selectedOrganization()) return NavigationScope.ORG
    return NavigationScope.LANDING
  }

  private navigateToInitialScope() {
    if (window.location.pathname.includes(OKTA_CALLBACK_ROUTE)) return
    if (this.selectedLocation()) {
      if (this.selectedLocation()) {
        this.router.navigate(['/secure/location-dashboard']).then()
      } else {
        this.router.navigate(['/secure/manage-organization']).then()
      }
    }
  }

  markAsSelectedScope(scope: NavigationScope): void {
    if (scope === NavigationScope.ORG && !this._selectedOrganization()) return
    if (scope === NavigationScope.LOCATION && !this._selectedLocation()) return
    this._selectedScope.set(scope)
  }

  selectOrganization(organization: Organization | null, clearLocation = true): void {
    if (!organization) {
      this.clearSelectedOrganization()
    } else {
      this._selectedOrganization.set(organization)
      this._selectedScope.set(NavigationScope.ORG)
      this.localStorageService.setItem(LocalStorageKey.ORGANIZATION, organization)
      this.appendToKnownOrganizations(organization)
      if (clearLocation) {
        this._selectedLocation.set(null)
        this.localStorageService.removeItem(LocalStorageKey.LOCATION)
      }
    }
  }

  private appendToKnownOrganizations(organization: Organization): void {
    if (this.knownOrganizations().some(o => o.id === organization.id)) return
    this._knownOrganizations.update(current => [...current, organization])
  }

  clearSelectedOrganization(): void {
    this._selectedOrganization.set(null)
    this._selectedLocation.set(null)
    this._selectedScope.set(NavigationScope.LANDING)
    this.localStorageService.removeItem(LocalStorageKey.ORGANIZATION)
    this.localStorageService.removeItem(LocalStorageKey.LOCATION)
  }

  selectLocation(location: Location | null): void {
    if (!location) {
      this.clearSelectedLocation()
    } else {
      this._selectedLocation.set(location)
      this._selectedScope.set(NavigationScope.LOCATION)
      this.localStorageService.setItem(LocalStorageKey.LOCATION, location)
    }
  }

  clearSelectedLocation(): void {
    this._selectedLocation.set(null)
    this._selectedScope.set(this._selectedOrganization() ? NavigationScope.ORG : NavigationScope.LANDING)
    this.localStorageService.removeItem(LocalStorageKey.LOCATION)
  }

  setPublicOrganizations(organizations: Organization[]): void {
    this._knownOrganizations.update(current => {
      const serverIds = new Set(organizations.map(o => o.id))
      const sessionOnly = current.filter(o => !serverIds.has(o.id))
      return [...organizations, ...sessionOnly]
    })
  }

  private loadSelectedOrganization(): Organization | null {
    return this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)
  }

  private loadSelectedLocation(): Location | null {
    return this.localStorageService.getItem<Location>(LocalStorageKey.LOCATION)
  }

}

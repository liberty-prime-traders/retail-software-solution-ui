import {computed, inject, Injectable, signal} from '@angular/core'
import {Organization} from '../../api/organization/organization.model'
import {Location} from '../../api/location/location.model'
import {LocalStorageKey} from '../types/local-storage-key.enum'
import {LocalStorageService} from './local-storage.service'

@Injectable({providedIn: 'root'})
export class SessionContextService {
	
	private readonly localStorageService = inject(LocalStorageService)

	readonly selectedOrganization = computed(() => this._selectedOrganization())
	readonly organizationIsSelected = computed(() => this._selectedOrganization() !== null)
	readonly selectedLocation = computed(() => this._selectedLocation())
	readonly locationIsSelected = computed(() => this._selectedLocation() !== null)
	readonly loggedInUserIsOrganizationAdmin = computed(() => this._loggedInUserIsOrganizationAdmin())
	readonly loggedInUserIsLocationAdmin = computed(() => this._loggedInUserIsLocationAdmin())
	
	receiveNewOrganization(createdOrganization: Organization): void {
		this.updateSelectedOrganization(createdOrganization)
		this.demoteFromLocationAdmin()
		this.clearSelectedLocation()
		this.promoteToOrganizationAdmin()
	}
	
	updateSelectedOrganization(organization: Organization|null): void {
		this._selectedOrganization.set(organization)
		this.localStorageService.setItem(LocalStorageKey.ORGANIZATION, organization)
	}
	
	updateSelectedLocation(location: Location|null): void {
		this._selectedLocation.set(location)
		this.localStorageService.setItem(LocalStorageKey.LOCATION, location)
	}
	
	clearSelectedOrganization(): void {
		this._selectedOrganization.set(null)
		this.demoteFromOrganizationAdmin()
		this.localStorageService.removeItem(LocalStorageKey.ORGANIZATION)
	}
	
	clearSelectedLocation(): void {
		this._selectedLocation.set(null)
		this.demoteFromLocationAdmin()
		this.localStorageService.removeItem(LocalStorageKey.LOCATION)
	}
	
	private promoteToOrganizationAdmin(): void {
		this._loggedInUserIsOrganizationAdmin.set(true)
	}
	
	private demoteFromOrganizationAdmin(): void {
		this._loggedInUserIsOrganizationAdmin.set(false)
	}
	
	private promoteToLocationAdmin(): void {
		this._loggedInUserIsLocationAdmin.set(true)
	}
	
	private demoteFromLocationAdmin(): void {
		this._loggedInUserIsLocationAdmin.set(false)
	}
	
	private readonly _selectedOrganization = signal<Organization|null>(null)
	private readonly _selectedLocation = signal<Location|null>(null)
	private readonly _loggedInUserIsOrganizationAdmin = signal<boolean>(false)
	private readonly _loggedInUserIsLocationAdmin = signal<boolean>(false)
	
}
